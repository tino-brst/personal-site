import type { NextApiHandler } from 'next'
import { IncomingHttpHeaders } from 'http'
import { prisma } from '@lib/prisma'
import { hash } from 'bcrypt'
import { maxUserLikeCount } from '@lib/constants'
import { Response } from 'types/response'

type Data = {
  totalLikeCount: number
  userLikeCount: number
}

const handler: NextApiHandler<Response<Data>> = async (req, res) => {
  const slug = req.query.slug as string
  const likeCount = parseInt(req.query.count as string)
  const method = req.method

  const ipAddress = getClientIpAddress(req.headers)
  const userId = await hash(ipAddress, process.env.BCRYPT_IP_SALT)

  if (method === 'GET') {
    const likesAggregation = await prisma.articleLikes.aggregate({
      where: {
        slug,
      },
      _sum: {
        count: true,
      },
    })

    const totalLikeCount = likesAggregation._sum.count ?? 0
    const shouldLookForUserLikes = totalLikeCount > 0

    let userLikeCount = 0

    if (shouldLookForUserLikes) {
      const userLikes = await prisma.articleLikes.findUnique({
        where: {
          slug_userId: {
            slug,
            userId,
          },
        },
      })

      userLikeCount = userLikes?.count ?? 0
    }

    // Both a valid article slug and an invalid one are going to return the same
    // response, given that there is no check being done against the 'Articles'
    // table.

    res.status(200).json({
      totalLikeCount,
      userLikeCount,
    })
  }

  if (method === 'POST') {
    const isValidLikeCount =
      !isNaN(likeCount) && likeCount >= 0 && likeCount <= maxUserLikeCount

    if (isValidLikeCount) {
      // TODO: handle scenario where the article slug passed does not exist in
      // the Articles table, violating the foreign key constraint (and throwing
      // an error). Rare scenario in practice, due to implying that a user liked
      // the article without visiting it (and thus creating its entry in the
      // Articles table), but still ...

      const userLikes = await prisma.articleLikes.upsert({
        where: {
          slug_userId: {
            slug,
            userId,
          },
        },
        create: {
          slug,
          userId,
          count: likeCount,
        },
        update: {
          count: likeCount,
        },
      })

      const likesAggregation = await prisma.articleLikes.aggregate({
        where: {
          slug,
        },
        _sum: {
          count: true,
        },
      })

      const totalLikeCount = likesAggregation._sum.count ?? 0

      res.status(200).json({
        totalLikeCount,
        userLikeCount: userLikes.count,
      })
    } else {
      res.status(400).json({
        message: `Invalid count`,
      })
    }
  }
}

function getClientIpAddress(headers: IncomingHttpHeaders): string {
  // The 'x-forwarded-for' header, which contains the IP address of the client
  // that made the request, is available only after deployment
  // (https://vercel.com/docs/edge-network/headers). When running the API
  // locally, we can just use the localhost IP address as fallback.
  // More info at https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For

  const xForwardedFor = headers['x-forwarded-for'] as string | undefined
  return xForwardedFor ? xForwardedFor.split(', ')[0] : '0.0.0.0'
}

export default handler
export type { Data as LikesResponseData }

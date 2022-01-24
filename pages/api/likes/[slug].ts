import type { NextApiHandler } from 'next'
import { IncomingHttpHeaders } from 'http'
import { prisma } from '@lib/prisma'
import { hash } from 'bcrypt'
import { Response } from 'types/response'
import { Prisma } from '@prisma/client'

type Data = {
  likeCount: number
  hasUserLike: boolean
}

const handler: NextApiHandler<Response<Data>> = async (req, res) => {
  const method = req.method
  const articleSlug = req.query.slug as string

  const ipAddress = getClientIpAddress(req.headers)
  const userId = await hash(ipAddress, process.env.BCRYPT_IP_SALT)

  if (method === 'GET') {
    const likeCount = await prisma.like.count({
      where: { articleSlug: articleSlug },
    })

    const userLike = await prisma.like.findUnique({
      where: {
        articleSlug_userId: {
          articleSlug,
          userId,
        },
      },
    })

    res.status(200).json({
      likeCount,
      hasUserLike: userLike !== null,
    })
  }

  if (method === 'PUT') {
    try {
      await prisma.like.create({
        data: { articleSlug, userId },
      })

      const likeCount = await prisma.like.count({
        where: { articleSlug },
      })

      res.status(200).json({
        likeCount,
        hasUserLike: true,
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Couldn't create the user like because it already exists

        const likeCount = await prisma.like.count({
          where: { articleSlug },
        })

        res.status(200).json({
          likeCount,
          hasUserLike: true,
        })
      } else {
        throw error
      }
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.like.delete({
        where: {
          articleSlug_userId: {
            articleSlug,
            userId,
          },
        },
      })

      const likeCount = await prisma.like.count({
        where: { articleSlug },
      })

      res.status(200).json({
        likeCount,
        hasUserLike: false,
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // Couldn't delete the user like because it doesn't exist

        const likeCount = await prisma.like.count({
          where: { articleSlug },
        })

        res.status(200).json({
          likeCount,
          hasUserLike: false,
        })
      } else {
        throw error
      }
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

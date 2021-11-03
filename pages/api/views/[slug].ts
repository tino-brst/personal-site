import type { NextApiHandler } from 'next'
import { prisma } from '@lib/prisma'
import { Response } from 'types/response'

type Data = {
  viewCount: number
}

// TODO: @mauro how do we check for valid slugs? Trying to read the file on each
// request doesn't sound great, it sounds like something that could be done
// during build time. An array of all article slugs.

const handler: NextApiHandler<Response<Data>> = async (req, res) => {
  const slug = req.query.slug as string
  const method = req.method

  if (method === 'GET') {
    const articleViews = await prisma.articleViews.findUnique({
      where: { slug },
    })

    if (articleViews) {
      res.status(200).json({
        viewCount: articleViews.count,
      })
    } else {
      res.status(404).json({ message: `Article with slug '${slug}' not found` })
    }
  }

  if (method === 'POST') {
    const articleViews = await prisma.articleViews.upsert({
      where: { slug },
      create: { slug, count: 1 },
      update: { count: { increment: 1 } },
    })

    res.status(200).json({
      viewCount: articleViews.count,
    })
  }
}

export default handler
export type { Data as ViewsResponseData }

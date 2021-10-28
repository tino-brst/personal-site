import type { NextApiHandler } from 'next'
import { prisma } from '@lib/prisma'
import { Response } from 'types/response'

type Data = {
  viewCount: number
}

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

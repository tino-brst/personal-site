import type { NextApiHandler } from 'next'
import { prisma } from '@lib/prisma'
import { Response } from 'types/response'

type ViewsData = {
  viewCount: number
}

const handler: NextApiHandler<Response<ViewsData>> = async (req, res) => {
  const slug = req.query.slug as string
  const method = req.method

  if (method === 'GET') {
    const article = await prisma.article.findUnique({
      where: { slug },
    })

    if (article) {
      res.status(200).json({
        viewCount: article.viewCount,
      })
    } else {
      res.status(404).json({ message: `Article with slug '${slug}' not found` })
    }
  }

  if (method === 'POST') {
    const article = await prisma.article.upsert({
      where: { slug },
      create: { slug, viewCount: 1 },
      update: { viewCount: { increment: 1 } },
    })

    res.status(200).json({
      viewCount: article.viewCount,
    })
  }
}

export default handler
export type { ViewsData }

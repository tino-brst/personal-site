import { prisma } from '@lib/prisma'
import type { NextApiHandler } from 'next'
import { Response } from 'types/response'

type Data = {
  viewCount: number
}

const handler: NextApiHandler<Response<Data>> = async (req, res) => {
  const method = req.method
  const slug = req.query.slug as string

  if (method === 'GET') {
    const article = await prisma.article.findUnique({
      where: { slug },
    })

    if (article) {
      res.status(200).json({
        viewCount: article.viewCount,
      })
    } else {
      res.status(404).json({
        message: `Article '${slug}' not found`,
      })
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
export type { Data as ViewsResponseData }

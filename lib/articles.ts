import path from 'path'
import fs from 'fs'
import { bundleMDX } from 'mdx-bundler'
import readingTime from 'reading-time'
import { rehypePrism } from './rehype-prism'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'

type Article = {
  slug: string
  title: string
  readingTime: string
  publishedOn: Date
  code: string
}

const articlesDirectoryPath = path.join(process.cwd(), 'articles')

async function parseArticle(filePath: string): Promise<Article> {
  const articleContents = fs.readFileSync(filePath, 'utf8')
  // TODO extract bundleMDX?
  const { code, frontmatter } = await bundleMDX(articleContents, {
    xdmOptions: (options) => ({
      ...options,
      rehypePlugins: [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutoLinkHeadings, { behaviour: 'wrap' }],
        rehypePrism,
      ],
    }),
  })

  return {
    slug: path.basename(filePath, '.mdx'),
    title: frontmatter.title,
    readingTime: readingTime(articleContents).text,
    publishedOn: new Date(frontmatter.publishedOn),
    code,
  }
}

async function getArticles(): Promise<Array<Article>> {
  return Promise.all(
    fs
      .readdirSync(articlesDirectoryPath)
      .map((fileName) => path.join(articlesDirectoryPath, fileName))
      .filter((filePath) => path.extname(filePath) === '.mdx')
      .map(parseArticle)
  )
}

async function getArticle(slug: string): Promise<Article> {
  const filePath = path.join(articlesDirectoryPath, `${slug}.mdx`)
  return parseArticle(filePath)
}

export { getArticles, getArticle }

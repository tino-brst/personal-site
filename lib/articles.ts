import path from 'path'
import fs from 'fs'
import readingTime from 'reading-time'
import { bundleMDX } from './bundle-mdx'

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
  const { code, frontmatter } = await bundleMDX(articleContents)

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

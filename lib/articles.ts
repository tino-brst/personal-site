import path from 'path'
import fs from 'fs'
import { bundleMDX } from 'mdx-bundler'
import readingTime from 'reading-time'

type Article = {
  slug: string
  title: string
  readingTime: string
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

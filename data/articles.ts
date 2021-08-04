import path from 'path'
import fs from 'fs'
import { bundleMDX } from 'mdx-bundler'

type Article = {
  id: string,
  title: string,
  code: string
}

const articlesDirectoryPath = path.join(process.cwd(), 'articles')

async function parseArticle(filePath: string): Promise<Article> {
  const articleContents = fs.readFileSync(filePath, 'utf8')
  const { code, frontmatter } = await bundleMDX(articleContents)

  return {
    id: path.basename(filePath, '.mdx'),
    title: frontmatter.title,
    code
  }
}

async function getArticles(): Promise<Array<Article>> {
  return Promise.all(
    fs.readdirSync(articlesDirectoryPath)
      .map((fileName) => path.join(articlesDirectoryPath, fileName))
      .filter((filePath) => path.extname(filePath) === '.mdx')
      .map(parseArticle)
  )
}

async function getArticle(id: string): Promise<Article> {
  const filePath = path.join(articlesDirectoryPath, `${id}.mdx`)
  return parseArticle(filePath)
}

export { getArticles, getArticle }
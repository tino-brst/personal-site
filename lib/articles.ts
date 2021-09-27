import path from 'path'
import fs from 'fs'
import readingTime from 'reading-time'
import { bundleMDX } from './bundle-mdx'
import { getTableOfContents, TableOfContents } from './mdast-util-toc'
import { unified } from 'unified'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'

type Article = {
  slug: string
  title: string
  tableOfContents: TableOfContents
  readingTime: string
  publishedOn: Date
  code: string
}

const articlesDirectoryPath = path.join(process.cwd(), 'articles')
const markdownProcessor = unified().use(remarkParse).use(remarkFrontmatter)

async function parseArticle(filePath: string): Promise<Article> {
  const articleContents = fs.readFileSync(filePath, 'utf8')
  const { code, frontmatter } = await bundleMDX(articleContents)
  const document = markdownProcessor.parse(articleContents)

  return {
    slug: path.basename(filePath, '.mdx'),
    title: frontmatter.title,
    tableOfContents: getTableOfContents(document),
    // TODO: use the one by titus?
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

import fs from 'fs'
import path from 'path'
import readingTime from 'reading-time'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { bundleMDX } from './bundle-mdx'
import { getTableOfContents, Root } from './mdast-util-toc'

type Article = {
  slug: string
  title: string
  description: string | null
  tags: Array<string>
  imageSrc: string | null
  imageOG: string | null
  tableOfContents: Root
  readingTime: string
  publishedOn: number
  contentCode: string
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
    description: frontmatter.description ?? null,
    tags: parseTags(frontmatter.tags),
    imageSrc: frontmatter.image ?? null,
    imageOG: frontmatter.imageOG ?? null,
    tableOfContents: getTableOfContents(document),
    readingTime: readingTime(articleContents).text,
    publishedOn: new Date(frontmatter.publishedOn).getTime(),
    contentCode: code,
  }
}

/**
 * `'Foo, Bar'` -> `['Foo', 'Bar']`
 */
function parseTags(value: string | undefined): Array<string> {
  return value ? value.split(',').map((tag) => tag.trim()) : []
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

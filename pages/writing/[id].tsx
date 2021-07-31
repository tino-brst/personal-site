import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import fs from 'fs'
import path from 'path'

type Props = {
  id: string
  code: string
  frontmatter: Record<string, string>
}

function ArticlePage(props: Props) {
  const MDXComponent = React.useMemo(
    () => getMDXComponent(props.code),
    [props.code]
  )

  return (
    <Layout>
      <h1>{props.frontmatter.title}</h1>
      <MDXComponent />
    </Layout>
  )
}

type PathParams = {
  id: string
}

const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  // we want to get a route 'writing/name-of-the-article' for each file we have
  // in our articles folder. If we return the filename of each article for each
  // path as its id, we get exactly that.

  const projectRoot = process.cwd()
  const articlesDirectoryPath = path.join(projectRoot, 'articles')
  const articleFileNames = fs
    .readdirSync(articlesDirectoryPath)
    .map(path.parse)
    .filter((parsedPath) => parsedPath.ext === '.mdx')
    .map((parsedPath) => parsedPath.name)

  return {
    paths: articleFileNames.map((id) => ({ params: { id } })),
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<Props, PathParams> = async (context) => {
  const articleFileName = context.params!.id

  const projectRoot = process.cwd()
  const articlesDirectoryPath = path.join(projectRoot, 'articles')
  const articlePath = path.join(articlesDirectoryPath, `${articleFileName}.mdx`)
  const articleContent = fs.readFileSync(articlePath, 'utf8')

  const { code, frontmatter } = await bundleMDX(articleContent)

  return {
    props: {
      id: articleFileName,
      code,
      frontmatter,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

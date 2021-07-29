import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import fs from 'fs'
import path from 'path'

type Props = {
  id: string
  content: string
}

function ArticlePage(props: Props) {
  return (
    <Layout>
      <h1>{props.id}</h1>
      <p>{props.content}</p>
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
    .filter((parsedPath) => parsedPath.ext === '.txt')
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
  const articlePath = path.join(articlesDirectoryPath, `${articleFileName}.txt`)
  const articleContent = fs.readFileSync(articlePath, 'utf8')

  return {
    props: {
      id: articleFileName,
      content: articleContent,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

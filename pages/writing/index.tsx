import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import fs from 'fs'
import path from 'path'

type Props = {
  articleIds: Array<string>
}

function WritingPage(props: Props) {
  return (
    <Layout>
      <h1>Writing</h1>
      <ul>
        {props.articleIds.map((id) => (
          <li key={id}>
            <Link href={`/writing/${id}`}>
              <a>{id}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

const getStaticProps: GetStaticProps<Props> = async () => {
  const projectRoot = process.cwd()
  const articlesDirectoryPath = path.join(projectRoot, 'articles')
  const articleFileNames = fs
    .readdirSync(articlesDirectoryPath)
    .map(path.parse)
    .filter((parsedPath) => parsedPath.ext === '.mdx')
    .map((parsedPath) => parsedPath.name)

  return {
    props: { articleIds: articleFileNames },
  }
}

export default WritingPage
export { getStaticProps }

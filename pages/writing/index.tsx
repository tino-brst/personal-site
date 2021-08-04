import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { getArticles } from 'data/articles'

type Props = {
  articleIds: Array<string>
}

function WritingPage(props: Props) {
  return (
    <Layout>
      <h1>Writing</h1>
      <ul>
        {/* TODO show more than just the ids */}
        {props.articleIds.map((id) => (
          <li key={id}>
            {/* TODO get current route instead of hard-coding 'writing'? */}
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
  const articles = await getArticles()

  return {
    props: { articleIds: articles.map((article) => article.id) },
  }
}

export default WritingPage
export { getStaticProps }

import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { getArticles } from 'data/articles'

type Props = {
  articles: Array<{
    id: string
    url: string
    title: string
    readingTime: string
  }>
}

function WritingPage(props: Props) {
  return (
    <Layout>
      <h1>Writing</h1>
      <ul>
        {props.articles.map((article) => (
          <li key={article.id}>
            <Link href={article.url}>
              <a>
                <h3>{article.title}</h3>
              </a>
            </Link>
            <span>{article.readingTime}</span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = await getArticles()

  return {
    props: {
      articles: articles.map((article) => ({
        id: article.id,
        url: `/writing/${article.id}`,
        title: article.title,
        readingTime: article.readingTime,
      })),
    },
  }
}

export default WritingPage
export { getStaticProps }

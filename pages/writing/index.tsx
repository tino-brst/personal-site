import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'

type Props = {
  articles: Array<{
    slug: string
    url: string
    title: string
    readingTime: string
    publishedOn: number
  }>
}

function WritingPage(props: Props) {
  return (
    <Layout>
      <h1>Writing</h1>
      <ul>
        {props.articles.map((article) => (
          <li key={article.slug}>
            <Link href={article.url}>
              <a>
                <h3>{article.title}</h3>
              </a>
            </Link>
            <span>
              {article.readingTime} • {formatDate(article.publishedOn)}
            </span>
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
      articles: articles
        .map((article) => ({
          slug: article.slug,
          url: `/writing/${article.slug}`,
          title: article.title,
          readingTime: article.readingTime,
          publishedOn: article.publishedOn.getTime(),
        }))
        .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn)),
    },
  }
}

export default WritingPage
export { getStaticProps }

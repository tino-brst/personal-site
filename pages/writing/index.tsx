import * as React from 'react'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { Layout } from '@components/Layout'
import { getArticles, getTags } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'

type Props = {
  articles: Array<{
    slug: string
    url: string
    title: string
    tags: Array<string>
    readingTime: string
    publishedOn: number
  }>
  tags: Array<string>
}

function WritingPage(props: Props) {
  const router = useRouter()

  const activeTagFilters = React.useMemo<Array<string>>(() => {
    return typeof router.query.tags === 'string'
      ? router.query.tags.split(',')
      : []
  }, [router.query.tags])

  // Adds/removes a tag from the active tag filters array and updates the url
  const toggleTagFilter = (value: string) => {
    const newActiveTagFilters = activeTagFilters.includes(value)
      ? activeTagFilters.filter((tag) => tag !== value)
      : [...activeTagFilters, value]

    const urlParams = new URLSearchParams()

    if (newActiveTagFilters.length) {
      urlParams.set('tags', newActiveTagFilters.join(','))
    }

    // TODO: if search ...

    const url = isEmpty(urlParams)
      ? `/writing`
      : `/writing?${urlParams.toString()}`

    router.replace(url, undefined, { shallow: true })
  }

  const articles = React.useMemo(() => {
    let articles = props.articles

    // If any tag filters are active, keep only those articles that are tagged
    // with _all_ of those active filters.
    // e.g. active: #Foo #Bar -> Show articles tagged with both #Foo _and_ #Bar
    if (activeTagFilters.length) {
      articles = articles.filter((article) =>
        activeTagFilters.every((tag) => article.tags.includes(tag))
      )
    }

    // TODO: filter by search terms

    return articles
  }, [props.articles, activeTagFilters])

  return (
    <Layout>
      <h1>Writing</h1>
      <p className="tag-filters">
        {props.tags.map((tag) => (
          <label key={tag}>
            <input
              type="checkbox"
              checked={activeTagFilters.includes(tag)}
              onChange={() => toggleTagFilter(tag)}
            />
            #{tag}
          </label>
        ))}
      </p>
      <ul className="articles-list">
        {articles.map((article) => (
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
      {/* TODO: define proper empty states ("no articles found with tags #Foo and #Bar") */}
      {!articles.length && (
        <p>
          <strong>No articles found</strong>
        </p>
      )}
    </Layout>
  )
}

function isEmpty<T>(iterable: Iterable<T>): boolean {
  return iterable[Symbol.iterator]().next().done ?? true
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
          tags: article.tags,
          readingTime: article.readingTime,
          publishedOn: article.publishedOn.getTime(),
        }))
        .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn)),
      // TODO: define sorting criteria for the tags (most articles? alphabetical?)
      tags: Array.from(getTags(articles)),
    },
  }
}

export default WritingPage
export { getStaticProps }

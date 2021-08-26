import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { getMDXComponent } from 'mdx-bundler/client'
import { getArticle, getArticles } from '@lib/articles'
import { useViewCount } from '@hooks/useViewCount'
import { useLikeCount } from '@hooks/useLikeCount'
import { maxUserLikeCount } from '@lib/constants'
import { formatDate } from '@lib/dates'

type Props = {
  slug: string
  title: string
  readingTime: string
  publishedOn: number
  code: string
}

function ArticlePage(props: Props) {
  const MDXComponent = React.useMemo(
    () => getMDXComponent(props.code),
    [props.code]
  )

  const viewCount = useViewCount(props.slug)
  const likeCount = useLikeCount(props.slug)

  return (
    <Layout>
      <h5>{formatDate(props.publishedOn)}</h5>
      <h1>{props.title}</h1>
      <h4>
        {props.readingTime} • {viewCount.isLoading ? '...' : viewCount.value}{' '}
        views
      </h4>
      <button disabled={likeCount.isLoading} onClick={likeCount.increment}>
        👍{' '}
        {`${likeCount.user ?? '...'}/${maxUserLikeCount} • ${
          likeCount.total ?? '...'
        }`}
      </button>
      <MDXComponent />
    </Layout>
  )
}

type PathParams = {
  slug: string
}

const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const articles = await getArticles()

  return {
    paths: articles.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<Props, PathParams> = async (context) => {
  const article = await getArticle(context.params!.slug)

  return {
    props: {
      slug: article.slug,
      title: article.title,
      readingTime: article.readingTime,
      publishedOn: article.publishedOn.getTime(),
      code: article.code,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

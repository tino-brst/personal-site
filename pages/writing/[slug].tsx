import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { getMDXComponent } from 'mdx-bundler/client'
import { getArticle, getArticles } from 'data/articles'
import { useViewCount } from 'hooks/useViewCount'

type Props = {
  slug: string
  title: string
  readingTime: string
  code: string
}

function ArticlePage(props: Props) {
  const MDXComponent = React.useMemo(
    () => getMDXComponent(props.code),
    [props.code]
  )

  const viewCount = useViewCount(props.slug)

  return (
    <Layout>
      <h1>{props.title}</h1>
      <h4>
        {props.readingTime} • {viewCount.isLoading ? '...' : viewCount.value}{' '}
        views
      </h4>
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
    paths: articles.map((article) => ({ params: { slug: article.slug } })),
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
      code: article.code,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

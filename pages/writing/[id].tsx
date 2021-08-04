import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '@components/Layout'
import { getMDXComponent } from 'mdx-bundler/client'
import { getArticle, getArticles } from 'data/articles'

type Props = {
  title: string
  code: string
}

function ArticlePage(props: Props) {
  const MDXComponent = React.useMemo(
    () => getMDXComponent(props.code),
    [props.code]
  )

  return (
    <Layout>
      <h1>{props.title}</h1>
      {/* TODO add reading time */}
      <MDXComponent />
    </Layout>
  )
}

type PathParams = {
  id: string
}

const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const articles = await getArticles()

  return {
    paths: articles.map((article) => ({ params: { id: article.id } })),
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<Props, PathParams> = async (context) => {
  const article = await getArticle(context.params!.id)

  return {
    props: {
      title: article.title,
      code: article.code,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

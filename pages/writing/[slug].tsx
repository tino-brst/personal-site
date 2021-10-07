import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getMDXComponent } from 'mdx-bundler/client'
import { TableOfContentsProvider } from 'contexts/table-of-contents'
import { useViewCount } from '@hooks/useViewCount'
import { useLikeCount } from '@hooks/useLikeCount'
import { maxUserLikeCount } from '@lib/constants'
import { getArticle, getArticles } from '@lib/articles'
import { formatDate } from '@lib/dates'
import { Section } from '@lib/mdast-util-toc'
import { Layout } from '@components/Layout'
import { CodeBlock } from '@components/markdown/CodeBlock'
import { TableOfContentsList } from '@components/TableOfContentsList'
import { BackToTopButton } from '@components/BackToTopButton'
import { TableOfContentsHeading } from '@components/TableOfContentsHeading'

type Props = {
  slug: string
  title: string
  tableOfContents: Array<Section>
  readingTime: string
  publishedOn: number
  code: string
}

function ArticlePage(props: Props) {
  const Content = React.useMemo(() => getMDXComponent(props.code), [props.code])

  const viewCount = useViewCount(props.slug)
  const likeCount = useLikeCount(props.slug)

  return (
    <Layout>
      <TableOfContentsProvider tableOfContents={props.tableOfContents}>
        <div className="floating-stuff">
          <BackToTopButton>Back to top 🔼</BackToTopButton>
          {/* TODO: probably shouldn't be shown if the entire article fits in the view, even if it does have multiple headings (see back-to-top button) */}
          <TableOfContentsList />
        </div>
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
        <Content
          components={{
            h2: (props) =>
              TableOfContentsHeading({ ...(props as any), level: 2 }),
            h3: (props) =>
              TableOfContentsHeading({ ...(props as any), level: 3 }),
            h4: (props) =>
              TableOfContentsHeading({ ...(props as any), level: 4 }),
            pre: CodeBlock,
          }}
        />
      </TableOfContentsProvider>
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
      tableOfContents: article.tableOfContents,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

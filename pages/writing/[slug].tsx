import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import { TableOfContentsProvider } from 'contexts/table-of-contents'
import { useViewCount } from '@hooks/useViewCount'
import { useLikeCount } from '@hooks/useLikeCount'
import { maxUserLikeCount } from '@lib/constants'
import { getArticle, getArticles } from '@lib/articles'
import { formatDate } from '@lib/dates'
import { Section } from '@lib/mdast-util-toc'
import { Layout } from '@components/Layout'
import { CodeBlock } from '@components/markdown/CodeBlock'
import { Image } from '@components/markdown/Image'
import { HeaderImage } from '@components/HeaderImage'
import { TableOfContentsList } from '@components/TableOfContentsList'
import { BackToTopButton } from '@components/BackToTopButton'
import { TableOfContentsHeading } from '@components/TableOfContentsHeading'
import Link from 'next/link'

type Props = {
  slug: string
  title: string
  tags: Array<string>
  headerImageSrc: string | null
  tableOfContents: Array<Section>
  readingTime: string
  publishedOn: number
  // TODO: rename to contentCode?
  code: string
}

function ArticlePage(props: Props) {
  const Content = React.useMemo(() => getMDXComponent(props.code), [props.code])

  const viewCount = useViewCount(props.slug)
  const likeCount = useLikeCount(props.slug)

  return (
    <Layout>
      <TableOfContentsProvider tableOfContents={props.tableOfContents}>
        {props.headerImageSrc && <HeaderImage src={props.headerImageSrc} />}
        <h5>{formatDate(props.publishedOn)}</h5>
        <h1>{props.title}</h1>
        <h4>
          {props.readingTime} • {viewCount.isLoading ? '...' : viewCount.value}{' '}
          views
          {props.tags.length ? (
            <div className="tags">
              {props.tags.map((tag) => (
                <Link key={tag} href={`/writing?tags=${tag}`}>
                  <a>#{tag}</a>
                </Link>
              ))}
            </div>
          ) : null}
        </h4>
        <button disabled={likeCount.isLoading} onClick={likeCount.increment}>
          👍{' '}
          {`${likeCount.user ?? '...'}/${maxUserLikeCount} • ${
            likeCount.total ?? '...'
          }`}
        </button>
        <Content components={components} />
        <div className="floating-stuff">
          <BackToTopButton>Back to top 🔼</BackToTopButton>
          {/* TODO: probably shouldn't be shown if the entire article fits in the view, even if it does have multiple headings (see back-to-top button) */}
          <TableOfContentsList />
        </div>
      </TableOfContentsProvider>
    </Layout>
  )
}

const components: ComponentMap = {
  h2: (props) => TableOfContentsHeading({ ...(props as any), level: 2 }),
  h3: (props) => TableOfContentsHeading({ ...(props as any), level: 3 }),
  h4: (props) => TableOfContentsHeading({ ...(props as any), level: 4 }),
  pre: CodeBlock,
  // TODO: open PR with props type as generic?
  img: (props) => Image({ ...(props as any) }),
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
      tags: article.tags,
      headerImageSrc: article.headerImage ?? null,
      readingTime: article.readingTime,
      publishedOn: article.publishedOn.getTime(),
      code: article.code,
      tableOfContents: article.tableOfContents,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import { TableOfContentsProvider } from 'contexts/table-of-contents'
import { useViewCount } from '@hooks/useViewCount'
import { useLikeCount } from '@hooks/useLikeCount'
import { maxUserLikeCount } from '@lib/constants'
import { getArticle, getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import { Section } from '@lib/mdast-util-toc'
import { Layout } from '@components/Layout'
import { CodeBlock } from '@components/markdown/CodeBlock'
import { Image } from '@components/markdown/Image'
import { HeaderImage } from '@components/HeaderImage'
import { TableOfContentsList } from '@components/TableOfContentsList'
import { BackToTopButton } from '@components/BackToTopButton'
import { TableOfContentsHeading } from '@components/TableOfContentsHeading'
import Link from 'next/link'

type RelatedArticle = {
  title: string
  url: string
}

type Props = {
  slug: string
  title: string
  tags: Array<string>
  headerImageSrc: string | null
  tableOfContents: Array<Section>
  readingTime: string
  publishedOn: number
  contentCode: string
  newerArticle: RelatedArticle | null
  olderArticle: RelatedArticle | null
}

function ArticlePage(props: Props) {
  const Content = React.useMemo(
    () => getMDXComponent(props.contentCode),
    [props.contentCode]
  )

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
        <br />
        <a
          href={editOnGitHubURL(
            'tino-brst',
            'personal-site',
            `articles/${props.slug}.mdx`
          )}
          target="_blank"
          rel="noreferrer"
        >
          Edit on GitHub
        </a>
        <br />
        <br />
        <div className="related-articles">
          {props.newerArticle && (
            <Link href={props.newerArticle.url}>
              <a>
                <p>
                  Newer: <b>{props.newerArticle.title}</b>
                </p>
              </a>
            </Link>
          )}
          {props.olderArticle && (
            <Link href={props.olderArticle.url}>
              <a>
                <p>
                  Older: <b>{props.olderArticle.title}</b>
                </p>
              </a>
            </Link>
          )}
        </div>
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

function editOnGitHubURL(
  username: string,
  repo: string,
  file: string,
  branch = 'main'
): string {
  return `https://github.com/${username}/${repo}/edit/${branch}/${file}`
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
  const articles = (await getArticles()).sort((a, b) =>
    compareDatesDesc(a.publishedOn, b.publishedOn)
  )

  const articleIndex = articles.findIndex(
    (article) => article.slug === context.params!.slug
  )

  const article = articles[articleIndex]
  const newerArticle = articles[articleIndex - 1]
  const olderArticle = articles[articleIndex + 1]

  return {
    props: {
      slug: article.slug,
      title: article.title,
      tags: article.tags,
      headerImageSrc: article.headerImage ?? null,
      readingTime: article.readingTime,
      publishedOn: article.publishedOn.getTime(),
      contentCode: article.contentCode,
      tableOfContents: article.tableOfContents,
      newerArticle: newerArticle
        ? { title: newerArticle.title, url: `/writing/${newerArticle.slug}` }
        : null,
      olderArticle: olderArticle
        ? { title: olderArticle.title, url: `/writing/${olderArticle.slug}` }
        : null,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

import * as React from 'react'
import styled from 'styled-components'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import { TableOfContentsProvider } from 'contexts/table-of-contents'
import { useViewCount } from '@hooks/useViewCount'
import { useLikeCount } from '@hooks/useLikeCount'
import { getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import { Section } from '@lib/mdast-util-toc'
import { Layout } from '@components/Layout'
import { CodeBlock } from '@components/markdown/CodeBlock'
import { Image } from '@components/markdown/Image'
import { Paragraph } from '@components/markdown/Paragraph'
import { TableOfContentsList } from '@components/TableOfContentsList'
import { BackToTopButton } from '@components/BackToTopButton'
import Link from 'next/link'
import NextImage from 'next/image'
import { Heading2, Heading3 } from '@components/markdown/Heading'
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons'

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
        <Wrapper>
          <Header>
            <Details>
              <DetailsItem>
                <CalendarIcon width={12} height={12} />
                <span>{formatDate(props.publishedOn)}</span>
              </DetailsItem>
              <DetailsItem>
                <ClockIcon width={12} height={12} />
                <span>{props.readingTime}</span>
              </DetailsItem>
            </Details>
            <Title>{props.title}</Title>
            {props.tags.length ? (
              <Tags>
                {props.tags.map((tag) => (
                  <Link key={tag} href={`/writing?tags=${tag}`} passHref={true}>
                    <Tag># {tag}</Tag>
                  </Link>
                ))}
              </Tags>
            ) : null}
            <HeaderImageWrapper>
              {props.headerImageSrc && (
                <NextImage
                  src={props.headerImageSrc}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </HeaderImageWrapper>
          </Header>
          {/* <button
            disabled={likeCount.isLoading}
            onClick={likeCount.toggleUserLike}
          >
            👍{' '}
            {`${likeCount.value ?? '...'} ${likeCount.hasUserLike ? '✔️' : ''}`}
          </button> */}
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
            {/* <BackToTopButton>Back to top 🔼</BackToTopButton> */}
            {/* TODO: probably shouldn't be shown if the entire article fits in the view, even if it does have multiple headings (see back-to-top button) */}
            {/* <TableOfContentsList /> */}
          </div>
        </Wrapper>
      </TableOfContentsProvider>
    </Layout>
  )
}

const components: ComponentMap = {
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  pre: CodeBlock,
  // TODO: open PR with props type as generic?
  img: (props: any) => Image({ ...props }),
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

const Wrapper = styled.div`
  padding-right: 24px;
  padding-left: 24px;
  margin-right: auto;
  margin-left: auto;
  max-width: 768px;
  isolation: isolate;
`

const Header = styled.div`
  margin-top: 40px;
`

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 14px;
  font-weight: 500;
  color: hsl(0 0% 60%);
`

const DetailsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 20px;
`

// TODO: hover & active states, overflowX (snap?)
const Tags = styled.div`
  display: flex;
  gap: 8px;
`

const Tag = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: hsl(0 0% 50%);
  background-color: hsla(0 0% 0% / 0.05);
  border-radius: 6px;
  padding: 4px 8px;
`

const HeaderImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 2 / 1;
  background-color: gainsboro;
  width: calc(100% + 24px * 2);
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 28px;
`

export default ArticlePage
export { getStaticPaths, getStaticProps }

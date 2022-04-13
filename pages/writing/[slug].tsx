import * as React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import { TableOfContentsProvider } from 'contexts/table-of-contents'
import { useViewCount } from '@hooks/useViewCount'
import { useLikeCount } from '@hooks/useLikeCount'
import { getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import { Root } from '@lib/mdast-util-toc'
import { Layout } from '@components/Layout'
import { CodeBlock } from '@components/markdown/CodeBlock'
import { Image } from '@components/markdown/Image'
import { Paragraph } from '@components/markdown/Paragraph'
import { Heading2, Heading3, Heading4 } from '@components/markdown/Heading'
import { Code } from '@components/markdown/Code'
import { Link } from '@components/markdown/Link'
import NextLink from 'next/link'
import NextImage from 'next/image'
import {
  CalendarIcon,
  ChevronUpIcon,
  ClockIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons'
import { useWindowEventListener } from '@hooks/useWindowEventListener'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'
import {
  AsideTableOfContents,
  TableOfContents,
} from '@components/TableOfContents'
import { EditOnGitHubLink } from '@components/EditOnGitHubLink'

const barHeight = 70
const barBottomMargin = 60

type RelatedArticle = {
  title: string
  url: string
}

type Props = {
  slug: string
  title: string
  tags: Array<string>
  headerImageSrc: string | null
  tableOfContents: Root
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

  // const viewCount = useViewCount(props.slug)
  // const likeCount = useLikeCount(props.slug)

  // Table of Contents

  const tableOfContentsRef = React.useRef<HTMLDivElement>(null)
  const tableOfContentsButtonRef = React.useRef<HTMLButtonElement>(null)

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] =
    React.useState(false)

  const closeTableOfContents = React.useCallback(() => {
    setIsTableOfContentsOpen(false)
  }, [])

  useOnInteractionOutside(
    [tableOfContentsRef, tableOfContentsButtonRef],
    closeTableOfContents,
    isTableOfContentsOpen
  )

  // Back to Top

  const [showBackToTop, setShowBackToTop] = React.useState(false)

  const updateShowBackToTop = React.useCallback(() => {
    // Show back-to-top button once the page has been scrolled at least the
    // height of the viewport
    setShowBackToTop(window.scrollY > window.innerHeight)
  }, [])

  function backToTop() {
    window.scroll({ behavior: 'smooth', top: 0 })
  }

  useWindowEventListener('scroll', updateShowBackToTop)
  useWindowEventListener('resize', updateShowBackToTop)

  return (
    <Layout>
      <TableOfContentsProvider tableOfContents={props.tableOfContents}>
        <Wrapper>
          <Aside />
          <Main>
            <Header>
              <Info>
                <InfoItem>
                  <CalendarIcon width={12} height={12} />
                  <span>{formatDate(props.publishedOn)}</span>
                </InfoItem>
                <InfoItem>
                  <ClockIcon width={12} height={12} />
                  <span>{props.readingTime}</span>
                </InfoItem>
              </Info>
              <Title>{props.title}</Title>
              {props.tags.length > 0 && (
                <Tags>
                  {props.tags.map((tag) => (
                    <NextLink
                      key={tag}
                      href={`/writing?tags=${tag}`}
                      passHref={true}
                    >
                      <Tag>
                        {/* TODO: use hashtag icon instead of character */}
                        <TagIcon>#</TagIcon>
                        {tag}
                      </Tag>
                    </NextLink>
                  ))}
                </Tags>
              )}
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
            <EditOnGitHubLink
              username="tino-brst"
              repo="personal-site"
              file={`articles/${props.slug}.mdx`}
            >
              Edit on GitHub
            </EditOnGitHubLink>
            <div className="related-articles">
              {props.newerArticle && (
                <NextLink href={props.newerArticle.url}>
                  <a>
                    <p>
                      Newer: <b>{props.newerArticle.title}</b>
                    </p>
                  </a>
                </NextLink>
              )}
              {props.olderArticle && (
                <NextLink href={props.olderArticle.url}>
                  <a>
                    <p>
                      Older: <b>{props.olderArticle.title}</b>
                    </p>
                  </a>
                </NextLink>
              )}
            </div>
          </Main>
          <Aside>
            <RightSideContent>
              {props.tableOfContents.children.length > 0 && (
                <AsideSection>
                  <AsideSectionHeader>
                    In this article
                    <ListBulletIcon width={18} height={18} />
                  </AsideSectionHeader>
                  <AsideTableOfContents />
                </AsideSection>
              )}
              {/* Divider? */}
              {/* Back to top */}
            </RightSideContent>
          </Aside>
        </Wrapper>
        <FloatingStuff>
          {/* TODO: add tooltips "Open Table Of Contents", "Back to Top", etc */}
          <ButtonGroup isExpanded={showBackToTop}>
            <BackToTopButton onClick={backToTop} isVisible={showBackToTop}>
              <ChevronUpIcon width={26} height={26} />
            </BackToTopButton>
            <ButtonGroupDivider isVisible={showBackToTop} />
            <TableOfContentsButton
              ref={tableOfContentsButtonRef}
              onClick={() => setIsTableOfContentsOpen((value) => !value)}
            >
              <ListBulletIcon width={26} height={26} />
            </TableOfContentsButton>
          </ButtonGroup>
          {/* TODO: probably shouldn't be shown if the entire article fits in the view, even if it does have multiple headings (see back-to-top button) */}
          <TableOfContentsWrapper
            className={clsx({ open: isTableOfContentsOpen })}
            ref={tableOfContentsRef}
          >
            <TableOfContentsHeader>In this article</TableOfContentsHeader>
            <TableOfContents onSelect={closeTableOfContents} />
          </TableOfContentsWrapper>
        </FloatingStuff>
      </TableOfContentsProvider>
    </Layout>
  )
}

const components: ComponentMap = {
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  p: Paragraph,
  pre: CodeBlock,
  code: Code,
  img: Image,
  a: Link,
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
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-start;
`

const Aside = styled.aside`
  flex: 1;
  display: none;
  position: sticky;
  top: ${barHeight + barBottomMargin}px;

  @media (min-width: 768px) {
    display: revert;
  }
`

const RightSideContent = styled.div`
  margin-left: 48px;
  margin-right: 16px;
  display: none;

  /* TODO: clean-up magic numbers */
  @media (min-width: calc(768px + 300px * 2)) {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
`

const AsideSection = styled.section``

const AsideSectionHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  color: hsla(0 0% 0% / 0.3);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 16px;
`

const Main = styled.main`
  flex: 0 1 768px;
  padding-right: 24px;
  padding-left: 24px;
`

const Header = styled.header``

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 14px;
  font-weight: 500;
  color: hsl(0 0% 60%);
`

const InfoItem = styled.div`
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

const Tags = styled.div`
  --border-radius: 8px;
  --gap: 8px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  max-width: 100vw;
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 24px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::after {
    /* Weird trick to get padding at the end/right of a scroll container (just
    like on the start/left, which works just fine without doing weird tricks)
    */
    content: '';
    padding-left: 24px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    margin: 0;
    padding: 0;
    max-width: 100%;
    flex-wrap: wrap;
    row-gap: var(--gap);

    &::after {
      display: none;
    }
  }
`

const Tag = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4ch;
  font-size: 14px;
  font-weight: 500;
  color: hsl(0 0% 0% / 0.7);
  background-color: hsla(0 0% 0% / 0.03);
  border-radius: var(--border-radius);
  padding: 6px 10px;
  scroll-snap-align: start;

  transition-property: transform, background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:not(:last-child) {
    margin-right: var(--gap);
  }

  &:hover {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &:active {
    background-color: hsla(0 0% 0% / 0.08);
    transform: scale(0.95);
  }
`

const TagIcon = styled.span`
  color: hsl(0 0% 0% / 0.3);
`

const HeaderImageWrapper = styled.div`
  --border-radius: 10px;
  position: relative;
  aspect-ratio: 2 / 1;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 32px;
  margin-bottom: 28px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 -1px 0 hsla(0 0% 0% / 0.1),
      inset 0 1px 0 hsla(0 0% 0% / 0.1);
  }

  @media (min-width: 768px) {
    border-radius: var(--border-radius);
    overflow: hidden;

    &::after {
      border-radius: var(--border-radius);
      box-shadow: inset 0 0 0 1px hsla(0 0% 0% / 0.1);
    }
  }
`

const FloatingStuff = styled.div`
  position: fixed;
  pointer-events: none;
  // TODO: extract to var
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
  gap: 12px;
  // TODO: same for these 16px
  width: calc(100vw - 2 * 16px);
  max-width: 380px;
  max-height: calc(100vh - 16px * 2 - ${barHeight}px);

  @media (min-width: calc(768px + 300px * 2)) {
    display: none;
  }
`

// TODO: switch to classes instead of props
const ButtonGroup = styled.div<{ isExpanded: boolean }>`
  --control-width: 46px;
  --divider-width: 1px;
  pointer-events: auto;
  z-index: 1;
  overflow: hidden;
  flex-shrink: 0;
  height: 44px;
  align-self: flex-end;
  display: flex;
  justify-content: right;
  border-radius: 10px;
  background: hsla(0 0% 99% / 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 10px 60px rgba(0, 0, 0, 0.1),
    0px 0px 0px 0.5px rgba(0, 0, 0, 0.05),
    inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.05);
  max-width: ${(p) =>
    p.isExpanded
      ? 'calc(var(--control-width) * 2 + var(--divider-width))'
      : 'var(--control-width)'};

  transition-property: max-width;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
`

const ButtonGroupDivider = styled.div<{ isVisible: boolean }>`
  flex: 0 0 var(--divider-width);
  height: 100%;
  background-color: hsla(0 0% 0% / 0.1);
  opacity: ${(p) => (p.isVisible ? 1 : 0)};

  transition-property: opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
`

const BackToTopButton = styled.button<{ isVisible: boolean }>`
  line-height: 0;
  flex-shrink: 0;
  width: var(--control-width);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(p) => (p.isVisible ? 1 : 0)};
  transform: ${(p) => (p.isVisible ? 'scale(1)' : 'scale(0.5)')};

  transition-property: opacity, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
`

const TableOfContentsButton = styled.button`
  line-height: 0;
  flex-shrink: 0;
  width: var(--control-width);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

// TODO: iOS like expanding animation? The menu expands vertically, not only scales
const TableOfContentsWrapper = styled.div`
  visibility: hidden;
  pointer-events: auto;
  opacity: 0;
  transform: translate(16px, 24px) scale(0.9);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 304px;
  border-radius: 14px;
  background: hsla(0 0% 98% / 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 10px 60px rgba(0, 0, 0, 0.1),
    0px 0px 0px 0.5px rgba(0, 0, 0, 0.05),
    inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.05);

  transition-property: opacity, transform, visibility;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  &.open {
    visibility: visible;
    opacity: 1;
    transform: none;
  }
`

const TableOfContentsHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: hsla(0 0% 100% / 0.7);
  box-shadow: inset 0 -1px hsla(0 0% 0% / 0.05);
  color: hsla(0 0% 0% / 0.3);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
`

export default ArticlePage
export { getStaticPaths, getStaticProps }

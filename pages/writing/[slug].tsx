import { AsideTableOfContents } from '@components/AsideTableOfContents'
import { FloatingTableOfContents } from '@components/FloatingTableOfContents'
import { Link } from '@components/Link'
import * as md from '@components/markdown'
import { Parallax } from '@components/Parallax'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useLikeCount } from '@hooks/useLikeCount'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'
import { useViewCount } from '@hooks/useViewCount'
import { useWindowEventListener } from '@hooks/useWindowEventListener'
import { getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import { Root } from '@lib/mdast-util-toc'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChevronUpIcon,
  ClockIcon,
  GitHubLogoIcon,
  HeartFilledIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons'
import clsx from 'clsx'
import { useNavBar } from 'contexts/nav-bar'
import { TableOfContentsProvider } from 'contexts/table-of-contents'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import styled, { css } from 'styled-components'

const barHeight = 70
const barBottomMargin = 48
const asideWidth = 240

type ArticlePreview = {
  title: string
  slug: string
  imageSrc: string | null
}

type Props = {
  slug: string
  title: string
  tags: Array<string>
  imageSrc: string | null
  tableOfContents: Root
  readingTime: string
  publishedOn: number
  contentCode: string
  newerArticle: ArticlePreview | null
  olderArticle: ArticlePreview | null
}

function ArticlePage(props: Props) {
  const router = useRouter()

  const Content = React.useMemo(
    () => getMDXComponent(props.contentCode),
    [props.contentCode]
  )

  const likeCount = useLikeCount(props.slug)
  const viewCount = useViewCount(props.slug)

  // Table of Contents

  const tableOfContentsRef = React.useRef<HTMLDivElement>(null)
  const tableOfContentsButtonRef = React.useRef<HTMLButtonElement>(null)

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] =
    React.useState(false)

  const closeTableOfContents = React.useCallback(() => {
    setIsTableOfContentsOpen(false)
  }, [])

  const toggleTableOfContents = React.useCallback(() => {
    setIsTableOfContentsOpen((value) => !value)
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

  useWindowEventListener('scroll', updateShowBackToTop)
  useWindowEventListener('resize', updateShowBackToTop)

  // Using a marker (just a hidden element), set the scrollY value that should
  // be considered the end of the article. Whenever there is a document size
  // change, that value is updated using the new position of the marker.

  const navBar = useNavBar()
  const contentEndMarkerRef = React.useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const contentEndMarker = contentEndMarkerRef.current

    if (!contentEndMarker) return

    const resizeObserver = new ResizeObserver(() => {
      const markerTop = contentEndMarker.getBoundingClientRect().top
      const markerTopRelativeToDocument = markerTop + window.scrollY

      navBar.setProgressCompleteThreshold(markerTopRelativeToDocument)
    })

    resizeObserver.observe(document.documentElement)

    return () => resizeObserver.disconnect()
  }, [navBar])

  return (
    <TableOfContentsProvider tableOfContents={props.tableOfContents}>
      <Wrapper>
        <HeaderImageWrapper>
          <StyledParallax
            multiplier={-0.1}
            getOffset={getOffset}
            // Rerender the component on path changes to avoid keeping its state
            // (i.e. its parallax effect) when going back and forth between
            // articles. Comment this line and, after scrolling to the bottom
            // and select the previous/next article, pay close attention to the
            // header image, it keeps the parallax accumulated from
            // scrolling on the previous article.
            key={router.asPath}
          >
            {props.imageSrc && (
              <NextImage
                src={props.imageSrc}
                layout="fill"
                objectFit="cover"
                priority
              />
            )}
          </StyledParallax>
          <HeaderImageOverlay />
        </HeaderImageWrapper>
        {props.tableOfContents.children.length > 0 && (
          <Aside>
            <AsideTableOfContents />
          </Aside>
        )}
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
        </Header>
        <Main>
          <Content components={components} />
          <ContentEndMarker ref={contentEndMarkerRef} />
          <ViewCount>{viewCount.value} views</ViewCount>
          <Thanks>
            <ThanksTitle>Thanks for reading!</ThanksTitle>
            <ThanksDescription>
              I would love to hear your thoughts, all feedback is very much
              welcome. You can find me on{' '}
              <a href="https://twitter.com/bursetAgustin">Twitter</a> or via{' '}
              <a href="mailto:tinos.corner@icloud.com">email</a>.
            </ThanksDescription>
            <LikeButton onClick={() => likeCount.toggleUserLike()}>
              <LikeButtonIcon
                className={clsx({ liked: likeCount.hasUserLike })}
              />
              {likeCount.value}
            </LikeButton>
          </Thanks>
          <EditOnGitHub>
            Found a typo?
            <EditOnGitHubLink
              href={getArticleEditOnGitHubURL(props.slug)}
              target="_blank"
            >
              <EditOnGitHubIcon />
              Edit on GitHub
            </EditOnGitHubLink>
          </EditOnGitHub>
        </Main>
      </Wrapper>
      <UpNext>
        <ArticleList>
          <ArticleListItem>
            {props.newerArticle && (
              <NextLink
                href={`/writing/${props.newerArticle.slug}`}
                passHref={true}
              >
                <ArticleLink className="next">
                  <ArticleImageWrapper>
                    {props.newerArticle.imageSrc && (
                      <ArticleImage
                        src={props.newerArticle.imageSrc}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                  </ArticleImageWrapper>
                  <ArticleDescription>
                    <ArticleTitle>{props.newerArticle.title}</ArticleTitle>
                    <ArticleLabel>Next</ArticleLabel>
                  </ArticleDescription>
                </ArticleLink>
              </NextLink>
            )}
          </ArticleListItem>
          <ArticleListItem>
            {props.olderArticle && (
              <NextLink
                href={`/writing/${props.olderArticle.slug}`}
                passHref={true}
              >
                <ArticleLink className="previous">
                  <ArticleImageWrapper>
                    {props.olderArticle.imageSrc && (
                      <ArticleImage
                        src={props.olderArticle.imageSrc}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                  </ArticleImageWrapper>
                  <ArticleDescription>
                    <ArticleTitle>{props.olderArticle.title}</ArticleTitle>
                    <ArticleLabel>Previously</ArticleLabel>
                  </ArticleDescription>
                </ArticleLink>
              </NextLink>
            )}
          </ArticleListItem>
        </ArticleList>
        <NextLink href="/writing" passHref>
          <AllArticlesLink>
            <AllArticlesIcon />
            All Articles
          </AllArticlesLink>
        </NextLink>
      </UpNext>
      <FloatingStuff>
        {/* TODO: add tooltips "Open Table Of Contents", "Back to Top", etc */}
        <ButtonGroup className={clsx({ expanded: showBackToTop })}>
          <ButtonBackground>
            <BackToTopButton onClick={backToTop}>
              <BackToTopIcon width={26} height={26} />
            </BackToTopButton>
          </ButtonBackground>
          <ButtonGroupDivider />
          <ButtonBackground>
            <TableOfContentsButton
              ref={tableOfContentsButtonRef}
              onClick={toggleTableOfContents}
            >
              <TableOfContentsIcon width={26} height={26} />
            </TableOfContentsButton>
          </ButtonBackground>
        </ButtonGroup>
        <FloatingTableOfContents
          ref={tableOfContentsRef}
          onSelect={closeTableOfContents}
          isOpen={isTableOfContentsOpen}
        />
      </FloatingStuff>
    </TableOfContentsProvider>
  )
}

const Wrapper = styled.div`
  --gap: 40px;

  isolation: isolate;
  margin-bottom: 48px;
  margin-top: -${barHeight + barBottomMargin}px;
  display: grid;
  grid-template-columns: 1fr min(100vw, calc(768px + 2 * 16px)) 1fr;
  grid-template-areas:
    '... header ...'
    '... main aside';
  grid-row-gap: var(--gap);
`

const HeaderImageWrapper = styled.div`
  position: relative;
  grid-row: 1;
  grid-column: 1 / -1;
  margin-bottom: -20px;
  overflow: hidden;
`

const StyledParallax = styled(Parallax)`
  position: absolute;
  inset: 0;
  z-index: -1;
`

const HeaderImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  top: ${barHeight}px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.48) 40%,
    rgba(255, 255, 255, 0.7) 60%,
    rgba(255, 255, 255, 0.78) 70%,
    rgba(255, 255, 255, 0.83) 75%,
    rgba(255, 255, 255, 0.88) 80%,
    rgba(255, 255, 255, 0.95) 90%,
    rgba(255, 255, 255, 1) 100%
  );
`

const Aside = styled.aside`
  grid-area: aside;
  align-self: start;
  position: sticky;
  top: calc(${barHeight}px + var(--gap));

  padding-left: 20px;
  padding-right: 24px;
  display: none;

  /* TODO: clean-up magic numbers */
  @media (min-width: calc(768px + 2 * 16px + ${asideWidth}px * 2)) {
    display: revert;
  }
`

const Main = styled.main`
  grid-area: main;
  padding-right: 24px;
  padding-left: 24px;

  & > *:first-child {
    margin-top: 0;
  }

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;
  }
`

const Header = styled.header`
  position: relative;
  grid-area: header;
  align-self: end;
  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: 48px;
  margin-top: 45vh;

  &::before {
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    display: block;
    content: '';
    height: 1px;
    background-color: hsla(0 0% 0% / 0.05);
  }

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 40vh;

    &::before {
      left: 32px;
      right: 32px;
    }
  }
`

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 14px;
  font-weight: 550;
  color: hsla(0 0% 40% / 0.9);
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Title = styled.h1`
  color: black;
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 0;
`

const Tags = styled.div`
  --gap: 8px;
  margin-top: 20px;
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
  overscroll-behavior: contain;

  &::after {
    /* Weird trick to get padding at the end/right of a scroll container (just
    like on the start/left, which works just fine without doing weird tricks)
    */
    content: '';
    padding-left: 40px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
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
  backdrop-filter: saturate(180%) blur(10px);
  border-radius: 8px;
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

const FloatingStuff = styled.div`
  --inset: 16px;

  z-index: 1;
  position: fixed;
  pointer-events: none;
  right: var(--inset);
  bottom: var(--inset);
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
  gap: 12px;
  width: calc(100vw - 2 * var(--inset));
  max-width: 380px;
  max-height: calc(100vh - var(--inset) * 2 - ${barHeight}px);

  @media (min-width: 640px) {
    --inset: 24px;
  }

  @media (min-width: calc(768px + 2 * 16px + ${asideWidth}px * 2)) {
    display: none;
  }
`

const ButtonGroup = styled.div`
  --button-width: 46px;
  --divider-width: 1px;

  pointer-events: auto;
  color: black;
  z-index: 1;
  overflow: hidden;
  flex-shrink: 0;
  height: 44px;
  align-self: flex-end;
  display: flex;
  justify-content: right;
  border-radius: 12px;
  background: hsla(0 0% 99% / 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 10px 60px rgba(0, 0, 0, 0.1),
    0px 0px 0px 1px rgba(0, 0, 0, 0.05);
  max-width: var(--button-width);

  transition-property: max-width;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;

  &.expanded {
    max-width: calc(var(--button-width) * 2 + var(--divider-width));
  }
`

const ButtonGroupDivider = styled.div`
  flex: 0 0 var(--divider-width);
  height: 100%;
  background-color: hsla(0 0% 0% / 0.05);
  opacity: 0;

  transition-property: opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;

  ${ButtonGroup}.expanded & {
    opacity: 1;
  }
`

const ButtonBackground = styled.div`
  line-height: 0;
  flex-shrink: 0;
  width: var(--button-width);
  height: 100%;

  transition-property: background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:hover {
    background-color: hsla(0 0% 0% / 0.03);
  }
`

const Button = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const TableOfContentsButton = styled(Button)``

const BackToTopButton = styled(Button)`
  opacity: 0;
  transform: scale(0.5);

  transition-property: opacity, transform;
  transition-duration: 0.15s;
  transition-delay: 0s;

  ${ButtonGroup}.expanded & {
    opacity: 1;
    transform: none;
    transition-delay: 0.1s;
  }
`

const sharedIconsStyles = css`
  transition-property: transform;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  ${Button}:active & {
    transform: scale(0.92);
  }
`

const TableOfContentsIcon = styled(ListBulletIcon)`
  ${sharedIconsStyles}
`

const BackToTopIcon = styled(ChevronUpIcon)`
  ${sharedIconsStyles}
`

const UpNext = styled.div`
  max-width: calc(768px + 2 * 16px);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 48px;

  display: flex;
  flex-direction: column;
  position: relative;
  gap: 32px;

  &::before {
    position: absolute;
    top: 0;
    left: 16px;
    right: 16px;
    display: block;
    content: '';
    height: 1px;
    background-color: hsla(0 0% 0% / 0.08);
  }

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;

    &::before {
      left: 32px;
      right: 32px;
    }
  }
`

const ArticleList = styled.ol`
  --gap: 16px;

  display: flex;
  flex-direction: column;
  gap: var(--gap);

  @media (min-width: 640px) {
    flex-direction: row-reverse;
  }
`

const ArticleListItem = styled.li`
  flex: 0 0 calc(50% - var(--gap) / 2);
`

const ArticleLink = styled.a`
  --padding: 12px;

  height: 100%;
  border-radius: 16px;
  background-color: hsla(0 0% 0% / 0.03);

  display: flex;
  padding: var(--padding);
  gap: var(--padding);

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  /* TODO: all hover states should also be applied while active, like below */
  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.05);
  }

  &:active {
    transform: scale(0.99);
  }

  @media (min-width: 640px) {
    flex-direction: column;
  }
`

const ArticleImageWrapper = styled.div`
  --border-radius: 6px;

  position: relative;
  aspect-ratio: 4 / 3;
  flex: 1 1 0;
  border-radius: var(--border-radius);
  overflow: hidden;

  /* Fixes corner overflow on image scale transition */
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  &::after {
    position: absolute;
    content: '';
    inset: 0;
    border-radius: var(--border-radius);
    box-shadow: inset 0 0 0 1px hsla(0 0% 0% / 0.1);

    transition-property: background-color;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  }

  ${ArticleLink}:hover &::after,
  ${ArticleLink}:active &::after {
    background-color: hsla(0 0% 0% / 0.08);
  }

  @media (min-width: 640px) {
    --border-radius: 6px;

    aspect-ratio: 2 / 1;
    flex: 0 0 auto;
  }
`

const ArticleImage = styled(NextImage)`
  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  ${ArticleLink}:hover &,
  ${ArticleLink}:active & {
    transform: scale(1.03);
  }
`

const ArticleDescription = styled.div`
  flex: 2 1 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  padding: 2px;
  padding-left: 0;

  @media (min-width: 640px) {
    flex: 1 0 auto;
    padding: 4px;
    padding-top: 0;
    margin-top: -2px;

    ${ArticleLink}.next & {
      align-items: flex-end;
      text-align: right;
    }
  }
`

const ArticleTitle = styled.h2`
  font-weight: 550;
  font-size: 16px;
  letter-spacing: 0.01em;
  line-height: 1.3em;
  color: hsla(0 0% 0% / 0.8);

  @media (min-width: 640px) {
    font-size: 18px;
  }
`

const ArticleLabel = styled.div`
  font-weight: 550;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: hsla(0 0% 0% / 0.4);
  line-height: 1;

  display: flex;
  justify-content: start;
  align-items: center;
  gap: 2px;

  ${ArticleLink}.previous & {
    flex-direction: row-reverse;
  }
`

const AllArticlesLink = styled(Link)`
  align-self: center;
  display: flex;
  align-items: center;
  gap: 8px;
`

const AllArticlesIcon = styled(ArrowLeftIcon)`
  width: 20px;
  height: 20px;
`

const ViewCount = styled.div`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 32px;
  color: hsla(0 0% 0% / 0.2);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
`

const Thanks = styled.div`
  padding: 24px;
  padding-top: 28px;
  border-radius: 16px;
  background-color: hsla(0 0% 0% / 0.03);
  margin-top: 32px;

  @media (min-width: 640px) {
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }
`

const ThanksTitle = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 550;
  color: hsla(0 0% 0% / 0.8);
`

const ThanksDescription = styled.p`
  margin-top: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 450;
  line-height: 1.5;
  color: hsla(0 0% 0% / 0.5);

  & a {
    color: hsla(0 0% 0% / 0.6);
    font-weight: 500;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 1px;
    text-decoration-color: hsla(0 0% 0% / 0.1);

    transition-property: text-decoration-color, color;
    transition-duration: 0.15s;
  }

  & a:hover {
    color: hsla(0 0% 0% / 0.7);
    text-decoration-color: hsla(0 0% 0% / 0.2);
  }
  @media (min-width: 640px) {
    font-weight: 400;

    & a {
      font-weight: 450;
    }
  }
`

const LikeButton = styled.button`
  user-select: none;
  margin-top: 16px;
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  line-height: 1;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
`

const LikeButtonIcon = styled(HeartFilledIcon)`
  color: hsla(0 0% 0% / 0.2);
  width: 24px;
  height: 24px;

  transition: color 0.15s;

  &.liked {
    color: hsla(0 0% 0% / 0.8);
  }
`

const EditOnGitHub = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  color: hsla(0 0% 0% / 0.4);
  font-size: 14px;
  font-weight: 500;
`

const EditOnGitHubLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
`

const EditOnGitHubIcon = styled(GitHubLogoIcon)`
  width: 18px;
  height: 18px;
`

const ContentEndMarker = styled.div`
  visibility: hidden;
`

/* ---------------------------------- Misc --------------------------------- */

function getOffset(element: HTMLElement): number {
  const { top } = element.getBoundingClientRect()

  const elementReferenceY = top
  const viewportReferenceY = 0

  return elementReferenceY - viewportReferenceY
}

function backToTop() {
  window.scroll({ behavior: 'smooth', top: 0 })
}

function getEditOnGitHubURL(
  username: string,
  repo: string,
  file: string,
  branch = 'main'
): string {
  return `https://github.com/${username}/${repo}/edit/${branch}/${file}`
}

function getArticleEditOnGitHubURL(slug: string) {
  return getEditOnGitHubURL(
    'tino-brst',
    'personal-site',
    `articles/${slug}.mdx`
  )
}

const components: ComponentMap = {
  h2: md.Heading2,
  h3: md.Heading3,
  h4: md.Heading4,
  p: md.Paragraph,
  pre: md.CodeBlock,
  code: md.Code,
  img: md.Image,
  a: md.Link,
  strong: md.Strong,
}

/* ---------------------------------- Next ---------------------------------- */

type PathParams = {
  slug: string
}

const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = (await getArticles()).map(({ slug }) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<Props, PathParams> = async (context) => {
  const articles = (await getArticles()).sort((a, b) =>
    compareDatesDesc(a.publishedOn, b.publishedOn)
  )

  const currentArticleIndex = articles.findIndex(
    (article) => article.slug === context.params!.slug
  )

  const currentArticle = articles[currentArticleIndex]
  const newerArticle = articles[currentArticleIndex - 1] ?? null
  const olderArticle = articles[currentArticleIndex + 1] ?? null

  return {
    props: {
      ...currentArticle,
      newerArticle,
      olderArticle,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }

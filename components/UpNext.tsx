import { Page } from '@lib/constants'
import NextImage from 'next/image'
import NextLink from 'next/link'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { ArrowLeftIcon } from './icons/ArrowLeftIcon'
import { Link } from './Link'

type ArticlePreview = {
  title: string
  slug: string
  imageSrc: string | null
}

type Props = {
  newerArticle: ArticlePreview | null
  olderArticle: ArticlePreview | null
}

function UpNext(props: Props) {
  return (
    <Root>
      <List>
        <ListItem>
          {props.newerArticle && (
            <NextLink href={Page.article(props.newerArticle.slug)} passHref>
              <ArticleLink>
                <ThumbnailWrapper>
                  {props.newerArticle.imageSrc && (
                    <Thumbnail
                      src={props.newerArticle.imageSrc}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  <ThumbnailOverlay />
                </ThumbnailWrapper>
                <Info>
                  <Title>{props.newerArticle.title}</Title>
                  <Label>Next</Label>
                </Info>
              </ArticleLink>
            </NextLink>
          )}
        </ListItem>
        <ListItem>
          {props.olderArticle && (
            <NextLink href={Page.article(props.olderArticle.slug)} passHref>
              <ArticleLink>
                <ThumbnailWrapper>
                  {props.olderArticle.imageSrc && (
                    <Thumbnail
                      src={props.olderArticle.imageSrc}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  <ThumbnailOverlay />
                </ThumbnailWrapper>
                <Info>
                  <Title>{props.olderArticle.title}</Title>
                  <Label>Previous</Label>
                </Info>
              </ArticleLink>
            </NextLink>
          )}
        </ListItem>
      </List>
      <NextLink href={Page.writing} passHref>
        <AllArticlesLink>
          <ArrowLeftIcon />
          All Articles
        </AllArticlesLink>
      </NextLink>
    </Root>
  )
}

const Root = styled.section`
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
    background-color: var(--color-border);
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

const List = styled.ol`
  --gap: 16px;

  display: flex;
  flex-direction: column;
  gap: var(--gap);

  @media (min-width: 640px) {
    flex-direction: row-reverse;
  }
`

const ListItem = styled.li`
  flex: 0 0 calc(50% - var(--gap) / 2);
`

const articleLinkHoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const ArticleLink = styled.a`
  --padding: 12px;

  height: 100%;
  border-radius: 16px;
  background-color: var(--color-bg-subtle);

  position: relative;
  display: flex;
  padding: var(--padding);
  gap: var(--padding);

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  @media (hover: hover) {
    &:hover {
      ${articleLinkHoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${articleLinkHoverStyles}
  }

  &:active {
    transform: scale(0.99);
  }

  @media (min-width: 640px) {
    flex-direction: column;
  }

  --focus-inset: -2px;
  --focus-radius: 18px;

  ${focusRing}
`

const ThumbnailWrapper = styled.div`
  --border-radius: 6px;

  position: relative;
  aspect-ratio: 4 / 3;
  flex: 1 1 0;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-border-inset);
  overflow: hidden;

  /* Fixes corner overflow on image scale transition */
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  &::after {
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: var(--shadow-border-inset);
    border-radius: var(--border-radius);
  }

  @media (min-width: 640px) {
    aspect-ratio: 2 / 1;
    flex: 0 0 auto;
  }
`

const thumbnailHoverStyles = css`
  transform: scale(1.03);
`

const Thumbnail = styled(NextImage)`
  will-change: transform;

  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  @media (hover: hover) {
    ${ArticleLink}:hover & {
      ${thumbnailHoverStyles}
    }
  }

  ${ArticleLink}:focus-visible & {
    ${thumbnailHoverStyles}
  }
`

const thumbnailOverlayHoverStyles = css`
  opacity: 1;
`

const ThumbnailOverlay = styled.div`
  position: absolute;
  content: '';
  inset: 0;
  opacity: 0;
  border-radius: var(--border-radius);
  background: var(--color-overlay);

  transition-property: opacity;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  @media (hover: hover) {
    ${ArticleLink}:hover & {
      ${thumbnailOverlayHoverStyles}
    }
  }

  ${ArticleLink}:focus-visible &,
  ${ArticleLink}:active & {
    ${thumbnailOverlayHoverStyles}
  }
`

const Info = styled.div`
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

    ${ListItem}:first-child & {
      align-items: flex-end;
      text-align: right;
    }
  }
`

const Title = styled.h2`
  font-weight: 550;
  font-size: 16px;
  letter-spacing: 0.01em;
  line-height: 1.3em;
  color: var(--color-fg-accent);

  @media (min-width: 640px) {
    font-size: 18px;
  }
`

const Label = styled.div`
  font-weight: 550;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: var(--color-fg-default);
  line-height: 1;

  display: flex;
  justify-content: start;
  align-items: center;
  gap: 2px;

  ${ListItem}:last-child & {
    flex-direction: row-reverse;
  }
`

const AllArticlesLink = styled(Link)`
  align-self: center;
  display: flex;
  align-items: center;
  gap: 8px;
`

export { UpNext }

import { Page } from '@lib/constants'
import { formatDate } from '@lib/dates'
import NextImage from 'next/image'
import NextLink from 'next/link'
import styled, { css, keyframes } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { ArrowRightIcon } from './icons/ArrowRightIcon'

type Props = {
  title: string
  slug: string
  publishedOn: number
  imageSrc: string | null
  titleInnerHtml?: string
}

function ArticleGridItem(props: Props) {
  return (
    <Root>
      <NextLink href={Page.article(props.slug)} passHref>
        <Link>
          <ThumbnailImageWrapper>
            {props.imageSrc && (
              <ThumbnailImage
                src={props.imageSrc}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 640px) 100vw, 55vw"
              />
            )}
            <ThumbnailImageOverlay />
          </ThumbnailImageWrapper>
          <Info>
            {props.titleInnerHtml ? (
              <Title
                dangerouslySetInnerHTML={{ __html: props.titleInnerHtml }}
              />
            ) : (
              <Title>{props.title}</Title>
            )}
            <InfoBottom>
              <PublicationDate>{formatDate(props.publishedOn)}</PublicationDate>
              <GoToIcon />
            </InfoBottom>
          </Info>
        </Link>
      </NextLink>
    </Root>
  )
}

const Root = styled.li`
  @media (min-width: 640px) {
    flex: 0 0 calc(50% - var(--gap) / 2);

    &:first-child {
      flex-basis: 100%;
    }
  }
`

const linkHoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const Link = styled.a`
  border-radius: 16px;
  height: 100%;

  isolation: isolate;
  padding: 12px;
  background-color: var(--color-bg-subtle);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  @media (hover: hover) {
    &:hover {
      ${linkHoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${linkHoverStyles}
  }

  &:active {
    transform: scale(0.99);
  }

  @media (min-width: 640px) {
    ${Root}:first-child & {
      flex-direction: row;
      gap: 14px;
    }

    ${Root}:first-child:active & {
      transform: scale(0.99);
    }
  }

  --focus-inset: -2px;
  --focus-radius: 18px;

  ${focusRing}
`

const ThumbnailImageWrapper = styled.div`
  --border-radius: 6px;

  aspect-ratio: 2 / 1;
  position: relative;
  border-radius: var(--border-radius);
  background-color: var(--color-bg-subtlerer);
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
    ${Root}:first-child & {
      flex: 2 1 0;
    }
  }
`

const thumbnailImageHoverStyles = css`
  transform: scale(1.03);
`

const ThumbnailImage = styled(NextImage)`
  will-change: transform;

  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  @media (hover: hover) {
    ${Link}:hover & {
      ${thumbnailImageHoverStyles}
    }
  }

  ${Link}:focus-visible & {
    ${thumbnailImageHoverStyles}
  }
`

const thumbnailImageOverlayHoverStyles = css`
  opacity: 1;
`

const ThumbnailImageOverlay = styled.div`
  position: absolute;
  content: '';
  inset: 0;
  opacity: 0;
  background: var(--color-overlay);
  border-radius: var(--border-radius);

  transition-property: opacity;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  @media (hover: hover) {
    ${Link}:hover & {
      ${thumbnailImageOverlayHoverStyles}
    }
  }

  ${Link}:focus-visible &,
  ${Link}:active & {
    ${thumbnailImageOverlayHoverStyles}
  }
`

const Info = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  padding: 4px;
  padding-top: 0;

  @media (min-width: 640px) {
    ${Root}:first-child & {
      flex: 1 1 0;

      padding: 4px;
      padding-left: 0;
    }
  }
`

const InfoBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

const highlight = keyframes`
  from {
    opacity: .5;
    transform: scale(.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
`

const Title = styled.h2`
  font-weight: 550;
  font-size: 22px;
  letter-spacing: 0.01em;
  color: var(--color-fg-accent);

  & > span {
    isolation: isolate;
    position: relative;
    text-underline-offset: 2px;
    text-decoration-thickness: 2px;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-color: var(--color-fg-muted);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--color-bg-highlight);
      border-radius: 4px;
      z-index: -1;
      animation: ${highlight} 0.15s;
    }
  }
`

const PublicationDate = styled.time`
  font-weight: 550;
  font-size: 14px;
  color: var(--color-fg-default);
`

const goToIconHoverStyles = css`
  stroke: var(--color-fg-muted-hover);
`

const GoToIcon = styled(ArrowRightIcon)`
  position: absolute;
  right: 0;
  bottom: 0;
  stroke: var(--color-fg-muted);

  transition-property: stroke;
  transition-duration: 0.1s;

  ${Link}:focus-visible &,
  ${Link}:active & {
    ${goToIconHoverStyles}
  }

  @media (hover: hover) {
    ${Link}:hover & {
      ${goToIconHoverStyles}
    }
  }
`

const ArticleGrid = styled.ol`
  --gap: 18px;

  display: flex;
  flex-direction: column;
  gap: var(--gap);

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

export { ArticleGrid, ArticleGridItem }

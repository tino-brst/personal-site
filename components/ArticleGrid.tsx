import { formatDate } from '@lib/dates'
import NextImage from 'next/image'
import NextLink from 'next/link'
import styled, { keyframes } from 'styled-components'
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
    <Wrapper>
      <NextLink href={`/writing/${props.slug}`} passHref>
        <Link>
          <ThumbnailImageWrapper>
            {props.imageSrc && (
              <ThumbnailImage
                src={props.imageSrc}
                layout="fill"
                objectFit="cover"
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
    </Wrapper>
  )
}

// TODO: while a search is active, remove having the first item be bigger than
// the others
const Wrapper = styled.li`
  @media (min-width: 640px) {
    flex: 0 0 calc(50% - var(--gap) / 2);

    &:first-child {
      flex-basis: 100%;
    }
  }
`

const Link = styled.a`
  border-radius: 16px;
  height: 100%;

  isolation: isolate;
  padding: 12px;
  background-color: var(--color-bg-subtle);

  display: flex;
  flex-direction: column;
  gap: 10px;

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: var(--color-bg-subtle-hover);
  }

  &:active {
    transform: scale(0.99);
  }

  @media (min-width: 640px) {
    ${Wrapper}:first-child & {
      flex-direction: row;
      gap: 14px;
    }

    ${Wrapper}:first-child:active & {
      transform: scale(0.99);
    }
  }
`

const ThumbnailImageWrapper = styled.div`
  --border-radius: 6px;

  aspect-ratio: 2 / 1;
  position: relative;
  border-radius: var(--border-radius);
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
    ${Wrapper}:first-child & {
      flex: 2 1 0;
    }
  }
`

// TODO apply hover effects only if using mouse
const ThumbnailImage = styled(NextImage)`
  will-change: transform;

  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  ${Link}:hover &,
  ${Link}:active & {
    transform: scale(1.03);
  }
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

  ${Link}:hover &,
  ${Link}:active & {
    opacity: 1;
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
    ${Wrapper}:first-child & {
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

// TODO while a search is active, de-emphasize the non matching text, keeping
// only the matches with full contrast. Fade in underline and contrast changes.
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
    text-decoration-color: var(--color-fg-subtle);

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

const GoToIcon = styled(ArrowRightIcon)`
  position: absolute;
  right: 0;
  bottom: 0;
  stroke: var(--color-fg-subtle);

  transition-property: stroke;
  transition-duration: 0.1s;

  ${Link}:hover & {
    stroke: var(--color-fg-subtle-hover);
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

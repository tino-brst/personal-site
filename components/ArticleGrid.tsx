import { formatDate } from '@lib/dates'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import NextImage from 'next/image'
import NextLink from 'next/link'
import styled from 'styled-components'

type Props = {
  slug: string
  title: string
  titleInnerHtml?: string
  publishedOn: number
  // TODO switch to thumbnailImageSrc?: string
  thumbnailImageSrc: string | null
}

function ArticleGridItem(props: Props) {
  return (
    <Wrapper>
      <NextLink href={`/writing/${props.slug}`} passHref={true}>
        <Link>
          <ThumbnailImageWrapper>
            {props.thumbnailImageSrc && (
              <ThumbnailImage
                src={props.thumbnailImageSrc}
                layout="fill"
                objectFit="cover"
              />
            )}
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
  background-color: hsla(0 0% 0% / 0.03);

  display: flex;
  flex-direction: column;
  gap: 10px;

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.05);
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
    border-radius: var(--border-radius);
    box-shadow: inset 0 0 0 1px hsla(0 0% 0% / 0.05);

    transition-property: background-color;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  }

  ${Link}:hover &::after,
  ${Link}:active &::after {
    background-color: hsla(0 0% 0% / 0.08);
  }

  @media (min-width: 640px) {
    ${Wrapper}:first-child & {
      flex: 2 1 0;
    }
  }
`

// TODO apply hover effects only if using mouse
const ThumbnailImage = styled(NextImage)`
  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  ${Link}:hover &,
  ${Link}:active & {
    transform: scale(1.03);
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
  align-items: flex-end;
  justify-content: space-between;
`

// TODO while a search is active, de-emphasize the non matching text, keeping
// only the matches with full contrast. Fade in underline and contrast changes.
const Title = styled.h2`
  font-weight: 550;
  font-size: 22px;
  letter-spacing: 0.01em;
  color: hsla(0 0% 0% / 0.8);

  & > span {
    text-underline-offset: 2px;
    text-decoration-thickness: 2px;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-color: hsla(0 0% 0% / 0.3);
  }
`

const PublicationDate = styled.time`
  font-weight: 550;
  font-size: 14px;
  color: hsla(0 0% 0% / 0.4);
`

const GoToIcon = styled(ArrowRightIcon)`
  width: 18px;
  height: 18px;
  color: hsla(0 0% 0% / 0.15);

  transition-property: color, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${Link}:hover & {
    color: hsla(0 0% 0% / 0.3);
    transform: scale(1.1);
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

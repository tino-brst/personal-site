import { ArrowLeftIcon } from '@radix-ui/react-icons'
import NextImage from 'next/image'
import NextLink from 'next/link'
import styled from 'styled-components'
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
    <Wrapper>
      <List>
        <ListItem>
          {props.newerArticle && (
            <NextLink href={`/writing/${props.newerArticle.slug}`} passHref>
              <ArticleLink>
                <ArticleImageWrapper>
                  {props.newerArticle.imageSrc && (
                    <ArticleImage
                      src={props.newerArticle.imageSrc}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  <ArticleImageOverlay />
                </ArticleImageWrapper>
                <ArticleInfo>
                  <ArticleTitle>{props.newerArticle.title}</ArticleTitle>
                  <ArticleLabel>Next</ArticleLabel>
                </ArticleInfo>
              </ArticleLink>
            </NextLink>
          )}
        </ListItem>
        <ListItem>
          {props.olderArticle && (
            <NextLink href={`/writing/${props.olderArticle.slug}`} passHref>
              <ArticleLink>
                <ArticleImageWrapper>
                  {props.olderArticle.imageSrc && (
                    <ArticleImage
                      src={props.olderArticle.imageSrc}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  <ArticleImageOverlay />
                </ArticleImageWrapper>
                <ArticleInfo>
                  <ArticleTitle>{props.olderArticle.title}</ArticleTitle>
                  <ArticleLabel>Previous</ArticleLabel>
                </ArticleInfo>
              </ArticleLink>
            </NextLink>
          )}
        </ListItem>
      </List>
      <NextLink href="/writing" passHref>
        <AllArticlesLink>
          <AllArticlesIcon />
          All Articles
        </AllArticlesLink>
      </NextLink>
    </Wrapper>
  )
}

const Wrapper = styled.section`
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

const ArticleLink = styled.a`
  --padding: 12px;

  height: 100%;
  border-radius: 16px;
  background-color: var(--color-bg-subtle);

  display: flex;
  padding: var(--padding);
  gap: var(--padding);

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  /* TODO: all hover states should also be applied while active, like below */
  &:hover,
  &:active {
    background-color: var(--color-bg-subtle-hover);
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

const ArticleImage = styled(NextImage)`
  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  ${ArticleLink}:hover &,
  ${ArticleLink}:active & {
    transform: scale(1.03);
  }
`

const ArticleImageOverlay = styled.div`
  position: absolute;
  content: '';
  inset: 0;
  opacity: 0;
  border-radius: var(--border-radius);
  background: var(--color-overlay);

  transition-property: opacity;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  ${ArticleLink}:hover &,
  ${ArticleLink}:active & {
    opacity: 1;
  }
`

const ArticleInfo = styled.div`
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

const ArticleTitle = styled.h2`
  font-weight: 550;
  font-size: 16px;
  letter-spacing: 0.01em;
  line-height: 1.3em;
  color: var(--color-fg-accent);

  @media (min-width: 640px) {
    font-size: 18px;
  }
`

const ArticleLabel = styled.div`
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

const AllArticlesIcon = styled(ArrowLeftIcon)`
  width: 20px;
  height: 20px;
`

export { UpNext }

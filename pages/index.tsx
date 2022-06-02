import { getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { GetStaticProps } from 'next'
import NextImage from 'next/image'
import NextLink from 'next/link'
import styled from 'styled-components'

type Props = {
  latestArticles: Array<{
    slug: string
    url: string
    title: string
    thumbnailImageSrc: string | null
    publishedOn: number
  }>
}

function HomePage(props: Props) {
  return (
    <Wrapper>
      <Title>Hi! I&apos;m Tino</Title>
      <Description>
        And this is my little corner of the internet. I&apos;m a design-minded
        developer specializing in web technologies. I like to lorem ipsum
        dolorem potatoes. And some other stuff.
      </Description>
      <NextLink href="/about" passHref={true}>
        <Link>
          About me
          {/* TODO: move icon sizes to css */}
          <ArrowRightIcon width={20} height={20} />
        </Link>
      </NextLink>
      <Heading>Latest Articles</Heading>
      <Articles>
        {props.latestArticles.map((article) => (
          <ArticleListItem key={article.slug}>
            <NextLink href={`/writing/${article.slug}`} passHref={true}>
              <ArticleLink>
                <ArticleImageWrapper>
                  {article.thumbnailImageSrc && (
                    <ArticleImage
                      src={article.thumbnailImageSrc}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </ArticleImageWrapper>
                <ArticleDescription>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleDescriptionBottom>
                    <ArticleDate>{formatDate(article.publishedOn)}</ArticleDate>
                    <GoToArticleIcon width={18} height={18} />
                  </ArticleDescriptionBottom>
                </ArticleDescription>
              </ArticleLink>
            </NextLink>
          </ArticleListItem>
        ))}
      </Articles>
      <NextLink href="/writing" passHref={true}>
        <Link>
          All articles
          <ArrowRightIcon width={20} height={20} />
        </Link>
      </NextLink>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-width: calc(768px + 2 * 16px);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;
  }
`

const Title = styled.h1`
  color: black;
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 24px;
`

const Description = styled.p`
  font-size: 16px;
  color: hsl(0 0% 50%);
  line-height: 1.5;
  margin-bottom: 32px;
`

const Link = styled.a`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  padding: 12px 14px;
  font-weight: 500;
  background-color: hsla(0 0% 0% / 0.03);
  color: black;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &:active {
    transform: scale(0.96);
  }
`

const Heading = styled.h2`
  color: black;
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 24px;
`

const Articles = styled.ol`
  --gap: 18px;

  margin-bottom: 32px;

  display: flex;
  flex-direction: column;
  gap: var(--gap);

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const ArticleListItem = styled.li`
  @media (min-width: 640px) {
    flex: 0 0 calc(50% - var(--gap) / 2);

    &:first-child {
      flex-basis: 100%;
    }
  }
`

const ArticleLink = styled.a`
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
    ${ArticleListItem}:first-child & {
      flex-direction: row;
      gap: 14px;
    }

    ${ArticleListItem}:first-child:active & {
      transform: scale(0.99);
    }
  }
`

const ArticleImageWrapper = styled.div`
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

  ${ArticleLink}:hover &::after,
  ${ArticleLink}:active &::after {
    background-color: hsla(0 0% 0% / 0.08);
  }

  @media (min-width: 640px) {
    ${ArticleListItem}:first-child & {
      flex: 2 1 0;
    }
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  padding: 4px;
  padding-top: 0;

  @media (min-width: 640px) {
    ${ArticleListItem}:first-child & {
      flex: 1 1 0;

      padding: 4px;
      padding-left: 0;
    }
  }
`

const ArticleDescriptionBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const ArticleTitle = styled.h2`
  font-weight: 550;
  font-size: 22px;
  letter-spacing: 0.01em;
  color: hsla(0 0% 0% / 0.8);
`

const ArticleDate = styled.time`
  font-weight: 550;
  font-size: 14px;
  color: hsla(0 0% 0% / 0.4);
`

const GoToArticleIcon = styled(ArrowRightIcon)`
  color: hsla(0 0% 0% / 0.15);

  transition-property: color, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${ArticleLink}:hover & {
    color: hsla(0 0% 0% / 0.3);
    transform: scale(1.1);
  }
`

const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = await getArticles()

  return {
    props: {
      latestArticles: articles
        .map((article) => ({
          slug: article.slug,
          url: `/writing/${article.slug}`,
          title: article.title,
          thumbnailImageSrc: article.headerImage ?? null,
          publishedOn: article.publishedOn.getTime(),
        }))
        .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn))
        .slice(0, 5),
    },
  }
}

export default HomePage
export { getStaticProps }

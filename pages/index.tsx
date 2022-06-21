import { ArticleGrid, ArticleGridItem } from '@components/ArticleGrid'
import { getArticles } from '@lib/articles'
import { compareDatesDesc } from '@lib/dates'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { GetStaticProps } from 'next'
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
      <ArticleGrid>
        {props.latestArticles.map((article) => (
          <ArticleGridItem key={article.slug} {...article} />
        ))}
      </ArticleGrid>
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

import { ArticleGrid, ArticleGridItem } from '@components/ArticleGrid'
import { Link } from '@components/Link'
import { Spacer } from '@components/Spacer'
import { getArticles } from '@lib/articles'
import { compareDatesDesc } from '@lib/dates'
import { pick } from '@lib/pick'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { GetStaticProps } from 'next'
import NextLink from 'next/link'
import styled from 'styled-components'

type ArticlePreview = {
  title: string
  slug: string
  publishedOn: number
  imageSrc: string | null
}

type Props = {
  articles: Array<ArticlePreview>
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
      <NextLink href="/about" passHref>
        <GoToLink>
          About me
          <GoToIcon />
        </GoToLink>
      </NextLink>
      <Heading>Latest Articles</Heading>
      <ArticleGrid>
        {props.articles.map((article) => (
          <ArticleGridItem key={article.slug} {...article} />
        ))}
      </ArticleGrid>
      <Spacer vertical size={32} />
      <NextLink href="/writing" passHref>
        <GoToLink>
          All articles
          <GoToIcon />
        </GoToLink>
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
  color: var(--color-fg-accent);
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 24px;
`

const Description = styled.p`
  font-size: 16px;
  color: var(--color-fg-default);
  line-height: 1.5;
  margin-bottom: 32px;
`

const Heading = styled.h2`
  color: var(--color-fg-accent);
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 24px;
`

const GoToLink = styled(Link)`
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
`

const GoToIcon = styled(ArrowRightIcon)`
  color: var(--color-fg-accent);
  width: 20px;
  height: 20px;
`

/* ---------------------------------- Next.js ------------------------------- */

const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = (await getArticles())
    .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn))
    .slice(0, 5)
    .map<ArticlePreview>((article) =>
      pick(article, ['slug', 'title', 'imageSrc', 'publishedOn'])
    )

  return {
    props: {
      articles,
    },
  }
}

export default HomePage
export { getStaticProps }

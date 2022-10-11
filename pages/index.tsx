import { ArticleGrid, ArticleGridItem } from '@components/ArticleGrid'
import { Crafter } from '@components/Crafter'
import { ArrowRightIcon } from '@components/icons/ArrowRightIcon'
import { Link } from '@components/Link'
import { getArticles } from '@lib/articles'
import { Page } from '@lib/constants'
import { compareDatesDesc } from '@lib/dates'
import { pick } from '@lib/pick'
import { getStaggerProps } from '@lib/stagger'
import { GetStaticProps } from 'next'
import { NextSeo, NextSeoProps } from 'next-seo'
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
  const seoProps: NextSeoProps = {
    title: `Tino's Corner`,
  }

  return (
    <Root>
      <NextSeo {...seoProps} />
      <Title {...getStaggerProps(0)}>Hi! I&apos;m Tino</Title>
      <Description {...getStaggerProps(1)}>
        Welcome to my little corner of the internet. I&apos;m a design-minded
        maker <Crafter /> of things, mostly software, mostly UIs. With a passion
        for stuff made with care.
      </Description>
      <NextLink href={Page.about} passHref>
        <GoToLink {...getStaggerProps(2)}>
          About me
          <GoToIcon />
        </GoToLink>
      </NextLink>
      <Heading {...getStaggerProps(3)}>Latest Articles</Heading>
      <StyledArticleGrid {...getStaggerProps(4)}>
        {props.articles.map((article) => (
          <ArticleGridItem key={article.slug} {...article} />
        ))}
      </StyledArticleGrid>
      <NextLink href={Page.writing} passHref>
        <GoToLink {...getStaggerProps(5)}>
          All articles
          <GoToIcon />
        </GoToLink>
      </NextLink>
    </Root>
  )
}

const Root = styled.div`
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
  color: var(--color-fg-default-opaque);
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
  stroke: var(--color-fg-accent);
  width: 20px;
  height: 20px;
`

const StyledArticleGrid = styled(ArticleGrid)`
  margin-bottom: 32px;
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

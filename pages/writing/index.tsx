import * as React from 'react'
import styled from 'styled-components'
import NextLink from 'next/link'
import NextImage from 'next/image'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { Layout } from '@components/Layout'
import { getArticles, getTags } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import fuzzy from 'fuzzysort'

type Props = {
  articles: Array<{
    slug: string
    url: string
    title: string
    thumbnailImageSrc: string | null
    tags: Array<string>
    readingTime: string
    publishedOn: number
  }>
  tags: Array<string>
}

// TODO: Idea 💡 First, make color-thief work with a next image (access
// underlying img element). Then try loading a tiny next image, and extract the
// main colors from that tiny image, maybe even have the image base64?

// TODO: remove unused color deps

function WritingPage(props: Props) {
  const router = useRouter()

  // TODO: couldn't all this "use the url params as store" thing be extracted to a hook?
  const searchTerms = React.useMemo<string>(
    () => (typeof router.query.search === 'string' ? router.query.search : ''),
    [router.query.search]
  )

  const activeTagFilters = React.useMemo<Array<string>>(
    () =>
      typeof router.query.tags === 'string' ? router.query.tags.split(',') : [],
    [router.query.tags]
  )

  const articles = React.useMemo(() => {
    let articles = props.articles

    if (activeTagFilters.length) {
      articles = articles.filter((article) =>
        includesEvery(article.tags, activeTagFilters)
      )
    }

    if (searchTerms) {
      const fuzzyResults = fuzzy.go(searchTerms, articles, {
        key: 'title',
      })

      articles = fuzzyResults.map((result) => ({
        ...result.obj,
        title: fuzzy.highlight(result, '<strong>', '</strong>') as string,
      }))
    }

    return articles
  }, [props.articles, activeTagFilters, searchTerms])

  // Updates the URL parameters without triggering a full refresh
  // https://nextjs.org/docs/routing/shallow-routing
  const updateRouteParams = (params: { tags: string; search: string }) => {
    router.replace(getURL('/writing', params), undefined, { shallow: true })
  }

  const handleTagFilterChange = (value: string) => {
    const newActiveTagFilters = toggle(activeTagFilters, value)

    // Update only what has changed, keep the rest as is (kinda like updating
    // the state in Redux)
    updateRouteParams({
      tags: newActiveTagFilters.join(','),
      search: searchTerms,
    })
  }

  const handleSearchTermsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSearchTerms = event.target.value

    updateRouteParams({
      tags: activeTagFilters.join(','),
      search: newSearchTerms,
    })
  }

  const handleClearButtonClick = () => {
    updateRouteParams({
      tags: activeTagFilters.join(','),
      search: '',
    })
  }

  return (
    <Layout>
      <Wrapper>
        <Title>Writing</Title>
        <Articles>
          {articles.map((article) => (
            <NextLink key={article.slug} href={article.url} passHref={true}>
              <Article>
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
                  <ArticleDate>{formatDate(article.publishedOn)}</ArticleDate>
                </ArticleDescription>
              </Article>
            </NextLink>
          ))}
        </Articles>

        {/* <div className="filters">
        <div className="filters__search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerms}
            onChange={handleSearchTermsChange}
          />
          {searchTerms && (
            <button onClick={handleClearButtonClick}>clear</button>
          )}
        </div>
        <div className="filters__tags">
          {props.tags.map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                checked={activeTagFilters.includes(tag)}
                onChange={() => handleTagFilterChange(tag)}
              />
              #{tag}
            </label>
          ))}
        </div>
      </div> */}
        {/* <ul className="articles-list">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={article.url}>
                <a>
                  {article.thumbnailImageSrc && (
                    <ThumbnailImage src={article.thumbnailImageSrc} />
                  )}
                  <h3 dangerouslySetInnerHTML={{ __html: article.title }} />
                </a>
              </Link>
              <span>
                {article.readingTime} • {formatDate(article.publishedOn)}
              </span>
            </li>
          ))}
        </ul> */}
        {/* TODO: define proper empty states ("no articles found with tags #Foo and #Bar") */}
        {!articles.length && (
          <p>
            <strong>No articles found</strong>
          </p>
        )}
      </Wrapper>
    </Layout>
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

// TODO: extract to component shared across pages? (moving margin to the
// articles list like the image in an article)
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 24px;
`

const Articles = styled.ol`
  --gap: 24px;

  margin-left: -8px;
  margin-right: -8px;

  display: flex;
  flex-direction: column;
  gap: var(--gap);

  @media (min-width: 640px) {
    margin-left: -24px;
    margin-right: -24px;

    flex-direction: row;
    flex-wrap: wrap;
  }
`

const Article = styled.a`
  border-radius: 16px;
  flex: 0 1 calc(50% - var(--gap) / 2);

  isolation: isolate;
  padding: 8px;
  background-color: hsla(0 0% 0% / 0.04);

  display: flex;
  flex-direction: column;
  gap: 4px;

  transition-property: transform, background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:hover {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &:active {
    transform: scale(0.98);
  }

  &:first-child:active {
    transform: scale(0.99);
  }

  @media (min-width: 640px) {
    &:first-child {
      flex-basis: 100%;
      flex-direction: row;
      gap: 6px;
    }
  }
`

const ArticleImageWrapper = styled.div`
  aspect-ratio: 2 / 1;
  position: relative;
  border-radius: 11px 11px 4px 4px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px hsla(0 0% 0% / 0.05);

  @media (min-width: 640px) {
    ${Article}:first-child & {
      flex: 2 1 0;
      border-radius: 11px 4px 4px 11px;
    }
  }
`

const ArticleImage = styled(NextImage)`
  z-index: -1;
`

const ArticleDescription = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  padding: 8px;

  @media (min-width: 640px) {
    ${Article}:first-child & {
      flex: 1 1 0;
    }
  }
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

/**
 * Given:
 * `getURL('/foo', { count: 42 })`
 *
 * Yields:
 * `'/foo?count=42'`
 */
function getURL<T extends Record<string, string>>(
  pathname: string,
  params: T
): string {
  const urlParams = new URLSearchParams()

  for (const key in params) {
    if (params[key]) {
      urlParams.append(key, params[key])
    }
  }

  return isEmpty(urlParams) ? pathname : `${pathname}?${urlParams}`
}

function isEmpty<T>(iterable: Iterable<T>): boolean {
  return iterable[Symbol.iterator]().next().done ?? true
}

/**
 * Adds/removes (toggles) a value to/from an array
 */
function toggle<T>(array: Array<T>, value: T): Array<T> {
  const valueIndex = array.findIndex((item) => item === value)

  return valueIndex < 0
    ? [...array, value]
    : [...array.slice(0, valueIndex), ...array.slice(valueIndex + 1)]
}

/**
 * Checks if an array contains all given values
 *
 * ```ts
 * includesEvery([1,2,3], [1])   // true
 * includesEvery([1,2,3], [1,4]) // false
 * ```
 */
function includesEvery<T>(array: Array<T>, values: Array<T>): boolean {
  return values.every((value) => array.includes(value))
}

const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = await getArticles()

  return {
    props: {
      articles: articles
        .map((article) => ({
          slug: article.slug,
          url: `/writing/${article.slug}`,
          title: article.title,
          thumbnailImageSrc: article.headerImage ?? null,
          tags: article.tags,
          readingTime: article.readingTime,
          publishedOn: article.publishedOn.getTime(),
        }))
        .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn)),
      // TODO: define sorting criteria for the tags (most articles? alphabetical?)
      tags: Array.from(getTags(articles)),
    },
  }
}

export default WritingPage
export { getStaticProps }

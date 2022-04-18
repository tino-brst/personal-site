import * as React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { Layout } from '@components/Layout'
import { getArticles, getTags } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import fuzzy from 'fuzzysort'
import { ThumbnailImage } from '@components/ThumbnailImage'

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

  const article = articles[0]

  return (
    <Layout>
      <Wrapper>
        <Title>Writing</Title>
        <List>
          <ListItem>
            <ItemImage />
            <ItemDescription>
              Id commodo magna irure sint ea sunt occaecat sunt qui. Do esse
              Lorem culpa mollit ad non incididunt ut ullamco cupidatat non
              anim.
            </ItemDescription>
          </ListItem>
          <ListItem>
            <ItemImage />
            <ItemDescription>
              Laboris sit reprehenderit aliqua officia minim mollit deserunt
              deserunt. Voluptate eu deserunt consectetur amet aliqua. Ex qui
              anim sunt culpa nulla magna excepteur sit est aliqua esse cillum.
              Ad qui ex sit incididunt sit commodo ex aute aliqua amet.
              Voluptate irure voluptate ex ullamco ad consectetur adipisicing
              velit ea.
            </ItemDescription>
          </ListItem>
          <ListItem>
            <ItemImage />
            <ItemDescription>
              Id commodo magna irure sint ea sunt occaecat sunt qui. Do esse
              Lorem culpa mollit ad non incididunt ut ullamco cupidatat non
              anim.
            </ItemDescription>
          </ListItem>
          <ListItem>
            <ItemImage />
            <ItemDescription>
              Id commodo magna irure sint ea sunt occaecat sunt qui. Do esse
              Lorem culpa mollit ad non incididunt ut ullamco cupidatat non
              anim.
            </ItemDescription>
          </ListItem>
        </List>

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
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
`

// TODO: extract to component shared across pages?
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 20px;
`

const List = styled.ol`
  margin-left: -8px;
  margin-right: -8px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const ListItem = styled.li`
  flex: 0 1 calc(50% - 16px / 2);
  padding: 8px;
  background-color: hsla(40deg 100% 95% / 1);

  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    &:first-child {
      flex-basis: 100%;
      flex-direction: row;
    }
  }
`

const ItemImage = styled.div`
  aspect-ratio: 2 / 1;
  background-color: hsla(240deg 100% 50% / 0.1);

  @media (min-width: 640px) {
    ${ListItem}:first-child & {
      flex: 2 1 0;
    }
  }
`

const ItemDescription = styled.div`
  flex-grow: 1;
  background-color: hsla(120deg 100% 50% / 0.1);

  padding: 8px;

  @media (min-width: 640px) {
    ${ListItem}:first-child & {
      flex: 1 1 0;
    }
  }
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

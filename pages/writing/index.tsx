import * as React from 'react'
import styled, { css } from 'styled-components'
import clsx from 'clsx'
import NextLink from 'next/link'
import NextImage from 'next/image'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { Layout } from '@components/Layout'
import { getArticles, getTags } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import fuzzy from 'fuzzysort'
import { ArrowRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useWindowEventListener } from '@hooks/useWindowEventListener'
import { useSize } from '@hooks/useSize'

type Article = {
  slug: string
  title: string
  thumbnailImageSrc: string | null
  tags: Array<string>
  readingTime: string
  publishedOn: number
}

type Props = {
  articles: Array<Article>
  tags: Array<string>
}

// TODO: Idea 💡 First, make color-thief work with a next image (access
// underlying img element). Then try loading a tiny next image, and extract the
// main colors from that tiny image, maybe even have the image base64?

// TODO: remove unused color deps

function WritingPage(props: Props) {
  const router = useRouter()

  // TODO: couldn't all this "use the url params as store" thing be extracted to a hook?
  const searchInputValue = React.useMemo<string>(
    () => (typeof router.query.search === 'string' ? router.query.search : ''),
    [router.query.search]
  )

  const activeTagFilters = React.useMemo<Array<string>>(
    () =>
      typeof router.query.tags === 'string' ? router.query.tags.split(',') : [],
    [router.query.tags]
  )

  const articles = React.useMemo(() => {
    let articles: Array<Article & { titleInnerHtml?: string }> = props.articles

    if (activeTagFilters.length) {
      articles = articles.filter((article) =>
        includesEvery(article.tags, activeTagFilters)
      )
    }

    if (searchInputValue) {
      const fuzzyResults = fuzzy.go(searchInputValue, articles, {
        key: 'title',
      })

      articles = fuzzyResults.map((result) => ({
        ...result.obj,
        titleInnerHtml: fuzzy.highlight(result, '<span>', '</span>') as string,
      }))
    }

    return articles
  }, [props.articles, activeTagFilters, searchInputValue])

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
      search: searchInputValue,
    })
  }

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateRouteParams({
      tags: activeTagFilters.join(','),
      search: event.target.value,
    })
  }

  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const searchButtonRef = React.useRef<HTMLButtonElement>(null)
  const searchPlaceholderRef = React.useRef<HTMLDivElement>(null)
  const cancelSearchButtonRef = React.useRef<HTMLButtonElement>(null)

  const searchPlaceholderSize = useSize(searchPlaceholderRef)
  const cancelSearchButtonSize = useSize(cancelSearchButtonRef)

  function cancelSearch() {
    setIsSearchOpen(false)

    // Clear search
    // updateRouteParams({
    //   tags: activeTagFilters.join(','),
    //   search: '',
    // })

    searchButtonRef.current?.focus()
  }

  function handleSearchButtonClick() {
    setIsSearchOpen(true)
    searchInputRef.current?.focus()
    // searchInputRef.current?.select()
  }

  // Close on Esc
  // TODO: extract custom useKeyDown('Escape', ...) hook?
  useWindowEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        cancelSearch()
      }
    },
    isSearchOpen
  )

  const searchButtonText = 'Search articles'

  return (
    <Layout>
      <Wrapper>
        <Title>Writing</Title>
        <Description>
          Thoughts on code, design, lorem ipsum, and more.
        </Description>
        <Search>
          <SearchInputButton
            className={clsx({ open: isSearchOpen })}
            style={{
              '--default-width': `${searchPlaceholderSize.width}px`,
              '--cancel-button-width': `${cancelSearchButtonSize.width}px`,
            }}
          >
            <SearchInputButtonPlaceholder ref={searchPlaceholderRef}>
              <SearchIcon />
              {searchButtonText}
            </SearchInputButtonPlaceholder>
            <SearchInput
              value={searchInputValue}
              onChange={handleSearchInputChange}
              ref={searchInputRef}
              placeholder={searchButtonText}
              tabIndex={isSearchOpen ? undefined : -1}
            />
            <CancelSearchButton
              ref={cancelSearchButtonRef}
              onClick={cancelSearch}
              tabIndex={isSearchOpen ? undefined : -1}
            >
              Cancel
            </CancelSearchButton>
            <SearchButton
              ref={searchButtonRef}
              onClick={handleSearchButtonClick}
              tabIndex={isSearchOpen ? -1 : undefined}
            >
              {searchButtonText}
            </SearchButton>
          </SearchInputButton>
          <FiltersToggle>filters</FiltersToggle>
        </Search>

        <Articles>
          {articles.map((article) => (
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
                    {article.titleInnerHtml ? (
                      <ArticleTitle
                        dangerouslySetInnerHTML={{
                          __html: article.titleInnerHtml,
                        }}
                      />
                    ) : (
                      <ArticleTitle>{article.title}</ArticleTitle>
                    )}
                    <ArticleDescriptionBottom>
                      <ArticleDate>
                        {formatDate(article.publishedOn)}
                      </ArticleDate>
                      <GoToArticleIcon width={18} height={18} />
                    </ArticleDescriptionBottom>
                  </ArticleDescription>
                </ArticleLink>
              </NextLink>
            </ArticleListItem>
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

        {/* TODO: add empty states */}
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

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  /* TODO: Above mobile */
  /* width: min(calc(100% + 2 * 8px),  400px); */
`

const SearchInputButton = styled.div`
  --transition: all 0.3s cubic-bezier(0.32, 0.08, 0.24, 1);
  --border-radius: 16px;
  --padding-x: 14px;
  --padding-y: 12px;
  --padding: var(--padding-y) var(--padding-x);
  --icon-size: 20px;
  --starting-font-weight: 500;
  --gap: 6px;

  position: relative;
  display: flex;
  flex: 0 1 var(--default-width);
  background-color: hsla(0 0% 0% / 0.03);
  border-radius: var(--border-radius);
  will-change: flex-grow;

  transition: var(--transition);

  &.open {
    flex-grow: 1;
  }

  /* TODO: active/hover transitions should be consistent with other links */
  /* TODO: transition only whats needed */

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &:not(.open):active {
    transform: scale(0.96);
  }
`

const SearchInputButtonPlaceholder = styled.div`
  color: transparent;
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: var(--gap);
  padding: var(--padding);
  font-weight: var(--starting-font-weight);
`

const SearchIcon = styled(MagnifyingGlassIcon)`
  width: var(--icon-size);
  height: var(--icon-size);
  color: black;

  transition: var(--transition);

  ${SearchInputButton}.open & {
    color: hsla(0 0% 0% / 0.5);
  }
`

const CancelSearchButton = styled.button`
  position: absolute;
  right: 0;
  height: 100%;
  padding-right: var(--padding-x);
  padding-left: var(--padding-x);
  transform: translateX(-4px);
  cursor: pointer;
  opacity: 0;
  font-weight: 500;
  color: black;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);

  /* TODO: look into animations to postpone its appearing when opening, and make
  the hiding quicker when closing */

  transition: var(--transition);

  ${SearchInputButton}.open & {
    transform: none;
    opacity: 1;
  }
`

const sharedInputButtonStyle = css`
  position: absolute;
  inset: 0;
  padding: var(--padding);
  padding-left: calc(var(--padding-x) + var(--icon-size) + var(--gap));
  border-radius: var(--border-radius);
`

const defaultTextStyle = css`
  color: black;
  font-weight: var(--starting-font-weight);
`

const openTextStyle = css`
  color: hsla(0 0% 0% / 0.3);
  font-weight: 400;
`

const SearchInput = styled.input`
  ${sharedInputButtonStyle}
  min-width: 0;
  opacity: 0;
  color: black;

  transition: var(--transition);

  ${SearchInputButton}.open & {
    opacity: 1;
    /* TODO: see if it can be delayed (animation keyframes?) */
    padding-right: var(--cancel-button-width);
  }

  /* Placeholder styles */

  &::placeholder {
    ${defaultTextStyle}
    transition: var(--transition);
  }

  ${SearchInputButton}.open &::placeholder {
    ${openTextStyle}
  }
`

const SearchButton = styled.button`
  ${sharedInputButtonStyle}
  ${defaultTextStyle}
  cursor: pointer;

  transition: var(--transition);

  ${SearchInputButton}.open & {
    ${openTextStyle}
    opacity: 0;
    pointer-events: none;
  }
`

const FiltersToggle = styled.button``

const Articles = styled.ol`
  --gap: 18px;

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

// TODO: while a search is active, remove having the first item be bigger than
// the others
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
  padding: 8px;
  background-color: hsla(0 0% 0% / 0.03);

  display: flex;
  flex-direction: column;
  gap: 4px;

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
      gap: 6px;
    }

    ${ArticleListItem}:first-child:active & {
      transform: scale(0.99);
    }
  }
`

const ArticleImageWrapper = styled.div`
  --border-radius: 11px 11px 4px 4px;

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
    box-shadow: inset 0 0 0 0.5px hsla(0 0% 0% / 0.1);

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
      --border-radius: 11px 4px 4px 11px;

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

  padding: 8px;

  @media (min-width: 640px) {
    ${ArticleListItem}:first-child & {
      flex: 1 1 0;
    }
  }
`

const ArticleDescriptionBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

// TODO: while a search is active, de-emphasize the text, keeping only the
// matches with full contrast. Fade in underline and contrast changes.
const ArticleTitle = styled.h2`
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

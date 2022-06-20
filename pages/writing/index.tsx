import { useOnKeyDown } from '@hooks/useOnKeyDown'
import { useQueryParam } from '@hooks/useQueryParam'
import { useSize } from '@hooks/useSize'
import { includesEvery, toggle } from '@lib/array'
import { getArticles } from '@lib/articles'
import { compareDatesDesc, formatDate } from '@lib/dates'
import {
  ArrowRightIcon,
  BorderStyleIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import clsx from 'clsx'
import fuzzy from 'fuzzysort'
import { GetStaticProps } from 'next'
import NextImage from 'next/image'
import NextLink from 'next/link'
import * as React from 'react'
import styled, { css } from 'styled-components'

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
  const [searchParam, setSearchParam] = useQueryParam('search')
  const search = typeof searchParam === 'string' ? searchParam : ''

  const [activeTagsParam, setActiveTagsParam] = useQueryParam('tags')
  const activeTags = React.useMemo(() => {
    return typeof activeTagsParam === 'string' ? activeTagsParam.split(',') : []
  }, [activeTagsParam])

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setSearchParam(value === '' ? undefined : value)
  }

  const handleActiveTagsChange = (value: string) => {
    const newActiveTags = toggle(activeTags, value).join(',')
    setActiveTagsParam(newActiveTags === '' ? undefined : newActiveTags)
  }

  const [isSearchOpen, setIsSearchOpen] = React.useState(search !== '')
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const searchButtonRef = React.useRef<HTMLButtonElement>(null)
  const searchPlaceholderRef = React.useRef<HTMLDivElement>(null)
  const cancelSearchButtonRef = React.useRef<HTMLButtonElement>(null)

  const searchPlaceholderSize = useSize(searchPlaceholderRef)
  const cancelSearchButtonSize = useSize(cancelSearchButtonRef)

  function cancelSearch() {
    setIsSearchOpen(false)
    searchButtonRef.current?.focus()
  }

  function handleSearchButtonClick() {
    setIsSearchOpen(true)
    searchInputRef.current?.focus()
    searchInputRef.current?.select()
  }

  useOnKeyDown(
    'Escape',
    (event) => {
      if (isElementInFocus(searchInputRef.current)) {
        // Prevents the browser exiting full-screen, besides closing the search
        event.preventDefault()
        cancelSearch()
      }
    },
    isSearchOpen
  )

  const searchButtonText = 'Search articles'

  const [isFiltersOpen, setIsFiltersOpen] = React.useState(
    activeTags.length > 0
  )
  const filtersRef = React.useRef<HTMLDivElement>(null)
  const filtersSize = useSize(filtersRef)

  const articles = React.useMemo(() => {
    let articles: Array<Article & { titleInnerHtml?: string }> = props.articles

    if (activeTags.length) {
      articles = articles.filter((article) =>
        includesEvery(article.tags, activeTags)
      )
    }

    if (isSearchOpen && search) {
      const fuzzyResults = fuzzy.go(search, articles, {
        key: 'title',
      })

      articles = fuzzyResults.map((result) => ({
        ...result.obj,
        titleInnerHtml: fuzzy.highlight(result, '<span>', '</span>') as string,
      }))
    }

    return articles
  }, [props.articles, activeTags, isSearchOpen, search])

  const availableTags = React.useMemo(
    () => Array.from(new Set(articles.map((article) => article.tags).flat())),
    [articles]
  )

  return (
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
            value={search}
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
        <FiltersToggleButton
          onClick={() => setIsFiltersOpen((value) => !value)}
        >
          <FiltersIcon />
          <ExpandIcon />
        </FiltersToggleButton>
      </Search>
      <FiltersWrapper
        className={clsx({
          ready: filtersSize.isReady,
          open: isFiltersOpen,
        })}
        style={{ '--content-height': `${filtersSize.height}px` }}
      >
        <Filters ref={filtersRef}>
          <FiltersTitle>Filter by tags</FiltersTitle>
          <Tags>
            {props.tags.map((tag) => (
              <li key={tag}>
                <Tag
                  className={clsx({
                    checked: activeTags.includes(tag),
                    disabled: !availableTags.includes(tag),
                  })}
                >
                  <TagInput
                    type="checkbox"
                    checked={activeTags.includes(tag)}
                    disabled={!availableTags.includes(tag)}
                    onChange={() => handleActiveTagsChange(tag)}
                  />
                  <TagIcon>#</TagIcon>
                  {tag}
                </Tag>
              </li>
            ))}
          </Tags>
        </Filters>
      </FiltersWrapper>

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
                    <ArticleDate>{formatDate(article.publishedOn)}</ArticleDate>
                    <GoToArticleIcon width={18} height={18} />
                  </ArticleDescriptionBottom>
                </ArticleDescription>
              </ArticleLink>
            </NextLink>
          </ArticleListItem>
        ))}
      </Articles>
      {/* TODO: add empty states */}
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
  margin-bottom: 24px;
`

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 400px;
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

const FiltersToggleButton = styled.button`
  cursor: pointer;
  padding: 12px 12px 12px 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.03);
  }

  &:active {
    transform: scale(0.96);
  }
`

const FiltersIcon = styled(BorderStyleIcon)`
  width: 20px;
  height: 20px;
  color: black;
`

const ExpandIcon = styled(CaretDownIcon)`
  width: 18px;
  height: 18px;
  color: black;
`

const FiltersWrapper = styled.div`
  --transition: all 0.3s cubic-bezier(0.32, 0.08, 0.24, 1);

  visibility: hidden;

  &.ready {
    transition: var(--transition);
    max-height: 0;
  }

  &.ready.open {
    visibility: visible;
    max-height: var(--content-height);
  }
`

const Filters = styled.div`
  padding-top: 24px;
`

const FiltersTitle = styled.h3`
  font-size: 12px;
  width: fit-content;
  color: hsla(0 0% 0% / 0.4);
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 16px;

  opacity: 0;
  transform: translateY(2px);

  transition: var(--transition);

  ${FiltersWrapper}.open & {
    opacity: 1;
    transform: none;
  }
`

const Tags = styled.ol`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  opacity: 0;
  transform: translateY(6px);

  transition: var(--transition);

  ${FiltersWrapper}.open & {
    opacity: 1;
    transform: none;
  }
`

const Tag = styled.label`
  --border-radius: 8px;
  position: relative;
  color: black;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: hsla(0 0% 0% / 0.03);
  border-radius: var(--border-radius);
  padding: 6px 10px;

  transition-property: transform, background-color, color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &.checked {
    background-color: hsl(0 0% 10%);
    color: hsla(0 0% 100% / 0.95);
  }

  &.disabled {
    background-color: hsla(0 0% 0% / 0.02);
    color: hsla(0 0% 0% / 0.3);
  }

  &:not(.disabled) {
    cursor: pointer;
  }

  &:not(.checked, .disabled):hover,
  &:not(.checked, .disabled):active {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &:not(.disabled):active {
    transform: scale(0.95);
  }
`

const TagInput = styled.input`
  position: absolute;
  inset: 0;
  border-radius: var(--border-radius);
`

const TagIcon = styled.span`
  color: hsl(0 0% 0% / 0.3);
  transform: scale(1.2);
  font-weight: 400;
  pointer-events: none;

  transition-property: color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${Tag}.checked & {
    color: hsl(0 0% 100% / 0.4);
  }

  ${Tag}.disabled & {
    color: hsl(0 0% 0% / 0.1);
  }
`

const Articles = styled.ol`
  --gap: 18px;

  margin-top: 32px;

  display: flex;
  flex-direction: column;
  gap: var(--gap);

  @media (min-width: 640px) {
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

function isElementInFocus(element: HTMLElement | null): boolean {
  return document.activeElement === element
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
      tags: Array.from(new Set(articles.flatMap((article) => article.tags))),
    },
  }
}

export default WritingPage
export { getStaticProps }

import { ArticleGrid, ArticleGridItem } from '@components/ArticleGrid'
import { FilterIcon } from '@components/icons/FilterIcon'
import { SearchInputButton } from '@components/SearchInputButton'
import { useQueryParam } from '@hooks/useQueryParam'
import { useSize } from '@hooks/useSize'
import { includesEvery, toggle } from '@lib/array'
import { getArticles } from '@lib/articles'
import { compareDatesDesc } from '@lib/dates'
import { pick } from '@lib/pick'
import { CaretDownIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import fuzzy from 'fuzzysort'
import { GetStaticProps } from 'next'
import * as React from 'react'
import styled from 'styled-components'

type ArticlePreview = {
  title: string
  slug: string
  publishedOn: number
  imageSrc: string | null
  tags: Array<string>
}

type Props = {
  articles: Array<ArticlePreview>
  tags: Array<string>
}

// TODO: remove unused color deps

function WritingPage(props: Props) {
  // Search

  const [searchParam, setSearchParam] = useQueryParam('search')

  const search = typeof searchParam === 'string' ? searchParam : ''

  function handleSearchChange(value: string) {
    setSearchParam(value === '' ? undefined : value)
  }

  const [isSearchOpen, setIsSearchOpen] = React.useState(search !== '')

  // Filter tags

  const [activeTagsParam, setActiveTagsParam] = useQueryParam('tags')

  const activeTags = React.useMemo(() => {
    return typeof activeTagsParam === 'string' ? activeTagsParam.split(',') : []
  }, [activeTagsParam])

  function handleActiveTagsChange(value: string) {
    const newActiveTags = toggle(activeTags, value).join(',')
    setActiveTagsParam(newActiveTags === '' ? undefined : newActiveTags)
  }

  const [isFiltersOpen, setIsFiltersOpen] = React.useState(
    activeTags.length > 0
  )

  const filtersRef = React.useRef<HTMLDivElement>(null)
  const filtersSize = useSize(filtersRef)

  // Articles filtering/sorting

  const articles = React.useMemo(() => {
    let articles: Array<ArticlePreview & { titleInnerHtml?: string }> = [
      ...props.articles,
    ]

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
          placeholder="Search articles"
          value={search}
          onChange={handleSearchChange}
          isOpen={isSearchOpen}
          onIsOpenChange={(value) => setIsSearchOpen(value)}
        />
        <FiltersToggleButton
          onClick={() => setIsFiltersOpen((value) => !value)}
        >
          <FilterIcon hasBadge={activeTags.length > 0} />
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
      <ArticleGrid>
        {articles.map((article) => (
          <ArticleGridItem key={article.slug} {...article} />
        ))}
      </ArticleGrid>
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

const ExpandIcon = styled(CaretDownIcon)`
  width: 18px;
  height: 18px;
  color: black;
`

const FiltersWrapper = styled.div`
  --transition: all 0.3s cubic-bezier(0.32, 0.08, 0.24, 1);

  margin-bottom: 32px;
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

/* ---------------------------------- Next.js ------------------------------- */

const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = (await getArticles())
    .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn))
    .map<ArticlePreview>((article) =>
      pick(article, ['slug', 'title', 'imageSrc', 'publishedOn', 'tags'])
    )

  // TODO: define sorting criteria for the tags (most articles? alphabetical?)
  const tags = Array.from(new Set(articles.flatMap((article) => article.tags)))

  return {
    props: {
      articles,
      tags,
    },
  }
}

export default WritingPage
export { getStaticProps }

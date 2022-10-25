import { ArticleGrid, ArticleGridItem } from '@components/ArticleGrid'
import { HashIcon } from '@components/icons/HashIcon'
import { SearchInputButton } from '@components/SearchInputButton'
import { useQueryParam } from '@hooks/useQueryParam'
import { includesEvery, toggle } from '@lib/array'
import { getArticles } from '@lib/articles'
import { compareDatesDesc } from '@lib/dates'
import { pick } from '@lib/pick'
import { getStaggerProps } from '@lib/stagger'
import clsx from 'clsx'
import fuzzy from 'fuzzysort'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import * as React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { focusRing } from 'styles/focusRing'

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

  const tags = React.useMemo(
    () =>
      props.tags.map((tag) => {
        const isActive = activeTags.includes(tag)
        const isDisabled = !isActive && !availableTags.includes(tag)

        return {
          value: tag,
          isActive,
          isDisabled,
        }
      }),
    [props.tags, activeTags, availableTags]
  )

  // Empty State

  function handleClearSearchButtonClick() {
    setSearchParam(undefined)
    setActiveTagsParam(undefined)
  }

  return (
    <>
      <NextSeo title="Writing" />
      <Root>
        <Title {...getStaggerProps(0)}>Writing</Title>
        <Description {...getStaggerProps(1)}>
          Thoughts on web development. Hopefully useful, and maybe even mildly
          entertaining.
        </Description>
        <Search {...getStaggerProps(2)}>
          <SearchInputButton
            placeholder="Search articles"
            value={search}
            onChange={handleSearchChange}
            isOpen={isSearchOpen}
            onIsOpenChange={(value) => setIsSearchOpen(value)}
          />
        </Search>
        {tags.length > 0 && (
          <Filters {...getStaggerProps(3)}>
            <FiltersTitle>Filter by tags</FiltersTitle>
            <Tags>
              {tags.map((tag) => (
                <li key={tag.value}>
                  <Tag
                    className={clsx({
                      checked: tag.isActive,
                      disabled: tag.isDisabled,
                    })}
                  >
                    <TagInput
                      type="checkbox"
                      checked={tag.isActive}
                      disabled={tag.isDisabled}
                      onChange={() => handleActiveTagsChange(tag.value)}
                    />
                    <TagIcon />
                    {tag.value}
                  </Tag>
                </li>
              ))}
            </Tags>
          </Filters>
        )}
        <ResultsWrapper {...getStaggerProps(4)}>
          {articles.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No articles found</EmptyStateTitle>
              <ClearSearchButton onClick={handleClearSearchButtonClick}>
                Clear search
              </ClearSearchButton>
            </EmptyState>
          ) : (
            <ArticleGrid>
              {articles.map((article) => (
                <ArticleGridItem key={article.slug} {...article} />
              ))}
            </ArticleGrid>
          )}
        </ResultsWrapper>
      </Root>
    </>
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
  font-size: 1rem;
  color: var(--color-fg-default-opaque);
  line-height: 1.7;
  margin-bottom: 24px;
`

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 640px) {
    max-width: 320px;
  }
`

const Filters = styled.div`
  margin-top: 24px;
`

const FiltersTitle = styled.h3`
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-fg-default);
`

const Tags = styled.ol`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const Tag = styled.label`
  isolation: isolate;
  position: relative;
  cursor: pointer;
  color: var(--color-fg-accent);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  padding: 8px 10px 8px 8px;
  will-change: transform;
  user-select: none;

  transition-property: transform, color;
  transition-duration: 0.15s;

  &:active {
    transform: scale(0.95);
  }

  &.checked {
    color: var(--color-fg-emphasis);
  }

  &.disabled {
    color: var(--color-fg-default);
    transform: none;
    cursor: default;
  }
`

const tagInputHoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const TagInput = styled.input`
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: 8px;
  background-color: var(--color-bg-subtle);

  transition-property: background-color;
  transition-duration: 0.15s;

  @media (hover: hover) {
    ${Tag}:hover & {
      ${tagInputHoverStyles}
    }
  }

  &:focus-visible,
  ${Tag}:active & {
    ${tagInputHoverStyles}
  }

  ${Tag}.checked & {
    background-color: var(--color-bg-emphasis);
  }

  ${Tag}.disabled & {
    background-color: var(--color-bg-subtler);
  }

  --focus-inset: -2px;
  --focus-radius: 10px;

  ${focusRing}
`

const TagIcon = styled(HashIcon)`
  width: 14px;
  height: 14px;
  stroke: var(--color-fg-muted);

  transition-property: stroke;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${Tag}.checked & {
    stroke: var(--color-fg-emphasis-subtle);
  }

  ${Tag}.disabled & {
    stroke: var(--color-fg-subtle);
  }
`

const ResultsWrapper = styled.div`
  margin-top: 32px;
`

const emptyStateFadeIn = keyframes`
  from {
    transform: scale(.95);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
`

const EmptyState = styled.div`
  --animation: ${emptyStateFadeIn} 0.3s backwards
    cubic-bezier(0.3, 0.69, 0.54, 1.01);

  margin-top: 84px;
  margin-bottom: 84px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`

const EmptyStateTitle = styled.h2`
  color: var(--color-fg-accent);
  font-size: 20px;
  font-weight: 550;

  animation: var(--animation);
`

const clearSearchButtonHoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const ClearSearchButton = styled.button`
  position: relative;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: var(--color-bg-subtle);
  color: var(--color-fg-default);
  padding: 8px 12px;
  border-radius: 9999px;

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease;

  animation: var(--animation);
  animation-delay: 0.1s;

  @media (hover: hover) {
    &:hover {
      ${clearSearchButtonHoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${clearSearchButtonHoverStyles}
  }

  &:active {
    transform: scale(0.96);
  }

  --focus-inset: -2px;
  --focus-radius: 9999px;

  ${focusRing}
`

/* ---------------------------------- Next.js ------------------------------- */

const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = (await getArticles())
    .sort((a, b) => compareDatesDesc(a.publishedOn, b.publishedOn))
    .map<ArticlePreview>((article) =>
      pick(article, ['slug', 'title', 'imageSrc', 'publishedOn', 'tags'])
    )

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

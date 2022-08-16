import { flatten, isSection, Root, Section, visit } from '@lib/mdast-util-toc'
import * as React from 'react'

type ContextValue = {
  items: Array<Section>
  isEmpty: boolean
  activeSectionId: string
  activeSectionAncestorIds: Array<string>
  registerSectionHeading: (heading: HTMLHeadingElement) => void
  unregisterSectionHeading: (heading: HTMLHeadingElement) => void
}

type Props = {
  tableOfContents: Root
  scrollOffsetTop: number
  children: React.ReactNode
}

const Context = React.createContext<ContextValue | undefined>(undefined)
Context.displayName = 'TableOfContentsContext'

function TableOfContentsProvider(props: Props) {
  const [activeSectionId, setActiveSectionId] = React.useState<string>('')
  const [activeSectionAncestorIds, setActiveSectionAncestorIds] =
    React.useState<Array<string>>([])
  const [headings, setHeadings] = React.useState<Array<HTMLElement>>([])

  const items = React.useMemo(
    () => flatten(props.tableOfContents).filter(isSection),
    [props.tableOfContents]
  )

  const sectionAncestorIdsMap = React.useMemo(() => {
    const map = new Map<string, Array<string>>()

    visit(props.tableOfContents, (node, ancestors) => {
      if (isSection(node)) {
        map.set(
          node.id,
          ancestors.filter(isSection).map(({ id }) => id)
        )
      }
    })

    return map
  }, [props.tableOfContents])

  const headingsInOrderOfAppearance = React.useMemo(() => {
    return [...headings].sort(compareOffsetTop)
  }, [headings])

  React.useEffect(() => {
    if (!headingsInOrderOfAppearance.length) return

    // Create and array containing all heading elements with their respective
    // offsetTops. Done out of the scroll handler to avoid calling a bunch of
    // getComputedStyles on each scroll event.

    // Beware: changing margins (e.g. due to having different values for
    // mobile/desktop) are not handled

    const headings = headingsInOrderOfAppearance.map((heading) => ({
      element: heading,
      top: getTop(heading),
    }))

    function handleWindowScroll() {
      const firstHeading = headings[0]

      // From the bottom, find the first heading that is at or past the top of
      // the window.
      const firstHeadingAtOrPastTop = findRight(headings, (heading) =>
        isAtOrPastWindowTop(heading.top, props.scrollOffsetTop)
      )

      // If there is no heading at/past the top of the window, then the first
      // one still hasn't crossed the top, and is chosen as the active one.
      const sectionId = firstHeadingAtOrPastTop
        ? firstHeadingAtOrPastTop.element.id
        : firstHeading.element.id

      setActiveSectionId(sectionId)
      setActiveSectionAncestorIds(sectionAncestorIdsMap.get(sectionId) ?? [])
    }

    // Make a 'manual' first call to compensate for the 'scroll' event not being
    // triggered on subscription, which could lead to a page scrolled
    // mid-article (e.g. via opening an #article-section link) and have the
    // wrong section as active.
    handleWindowScroll()

    // TODO: handle margins (for nav-bars, etc)
    // TODO: handle other elements besides the window as root
    window.addEventListener('scroll', handleWindowScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [
    headingsInOrderOfAppearance,
    sectionAncestorIdsMap,
    props.scrollOffsetTop,
  ])

  const registerSectionHeading = React.useCallback(
    (heading: HTMLHeadingElement) => {
      setHeadings((headings) => [...headings, heading])
    },
    []
  )

  const unregisterSectionHeading = React.useCallback(
    (heading: HTMLHeadingElement) => {
      setHeadings((headings) => headings.filter((e) => e !== heading))
    },
    []
  )

  const value = React.useMemo<ContextValue>(
    () => ({
      items,
      isEmpty: props.tableOfContents.children.length === 0,
      activeSectionId,
      activeSectionAncestorIds,
      registerSectionHeading,
      unregisterSectionHeading,
    }),
    [
      items,
      props.tableOfContents.children.length,
      activeSectionId,
      activeSectionAncestorIds,
      registerSectionHeading,
      unregisterSectionHeading,
    ]
  )

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

function useTableOfContents() {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error(
      'useTableOfContents must be used within a TableOfContentsProvider'
    )
  }

  return context
}

/**
 * An element is considered to go before another element, if its top border is
 * higher in the viewport.
 */
function compareOffsetTop(a: HTMLElement, b: HTMLElement): number {
  return a.offsetTop - b.offsetTop
}

/**
 * Same as `Array.find()`, but from right to left.
 */
function findRight<T>(
  array: Array<T>,
  predicate: (value: T, index?: number, array?: Array<T>) => boolean
): T | undefined {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index], index, array)) {
      return array[index]
    }
  }
}

/**
 * Checks if an element's top border is at/past the viewport's top border or
 * not.
 *
 * An element is considered _at the window top_, if its top matches the window
 * vertical scroll, and _past the top_ if its top value is smaller than the
 * window's vertical scroll. Some browsers, when scrolling an element into view
 * with a top at (for example) `y = 20`, may scroll the window to a `y = 19.5`,
 * instead of 20 (which is just below the threshold). To still consider that
 * element as 'at the top', a slight bias is added, rounding the number up.
 */
function isAtOrPastWindowTop(elementTop: number, offset = 0) {
  return elementTop <= Math.ceil(window.scrollY) + offset
}

/**
 * Gets an element's offset top taking into account its top margin.
 */
function getTop(element: HTMLElement): number {
  const style = window.getComputedStyle(element)
  const marginTop = parseInt(style.marginTop)

  return marginTop === NaN ? element.offsetTop : element.offsetTop - marginTop
}

export { TableOfContentsProvider, useTableOfContents }

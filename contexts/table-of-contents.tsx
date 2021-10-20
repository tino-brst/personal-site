import { Section } from '@lib/mdast-util-toc'
import * as React from 'react'

type ContextValue = {
  value: Array<Section>
  isEmpty: boolean
  activeSectionId: string | undefined
  activeSectionAncestorIds: Array<string>
  registerSectionHeading: (heading: HTMLHeadingElement) => void
  unregisterSectionHeading: (heading: HTMLHeadingElement) => void
}

type Props = {
  tableOfContents: Array<Section>
  children: React.ReactNode
}

const Context = React.createContext<ContextValue | undefined>(undefined)
Context.displayName = 'TableOfContentsContext'

function TableOfContentsProvider(props: Props) {
  const [activeSectionId, setActiveSectionId] = React.useState<string>('')
  const [activeSectionAncestorIds, setActiveSectionAncestorIds] =
    React.useState<Array<string>>([])
  const [headings, setHeadings] = React.useState<Array<HTMLElement>>([])

  const sectionAncestorIdsMap = React.useMemo(() => {
    const map = new Map<string, Array<string>>()

    for (const section of props.tableOfContents) {
      visit(section, (section, ancestors) => {
        map.set(
          section.id,
          ancestors.map(({ id }) => id)
        )
      })
    }

    return map
  }, [props.tableOfContents])

  const headingsSortedByOrderOfAppearance = React.useMemo(
    () => [...headings].sort(compareOffsetTop),
    [headings]
  )

  React.useEffect(() => {
    if (!headingsSortedByOrderOfAppearance.length) return

    const handleWindowScroll = () => {
      const firstHeading = headingsSortedByOrderOfAppearance[0]

      // From the bottom, find the first heading that is at or past the top of
      // the window.
      const firstHeadingAtOrPastTop = findRight(
        headingsSortedByOrderOfAppearance,
        isAtOrPastWindowTop
      )

      // If there is no heading at/past the top of the window, then the first
      // one still hasn't crossed the top, and is chosen as the active one.
      const sectionId = firstHeadingAtOrPastTop
        ? firstHeadingAtOrPastTop.id
        : firstHeading.id

      setActiveSectionId(sectionId)
      setActiveSectionAncestorIds(sectionAncestorIdsMap.get(sectionId) ?? [])
    }

    // Make a 'manual' first call to compensate for the 'scroll' event not being
    // triggered on load, which could cause to maybe be mid-page (e.g. via
    // opening a ...#some-section link) and have the wrong section as active.
    handleWindowScroll()

    // TODO: handle margins (for nav-bars, etc)
    // TODO: handle other elements besides the window as root
    window.addEventListener('scroll', handleWindowScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [headingsSortedByOrderOfAppearance, sectionAncestorIdsMap])

  const registerSectionHeading = (heading: HTMLHeadingElement) => {
    setHeadings((headings) => [...headings, heading])
  }

  const unregisterSectionHeading = (heading: HTMLHeadingElement) => {
    setHeadings((headings) => headings.filter((e) => e !== heading))
  }

  const value = React.useMemo<ContextValue>(
    () => ({
      value: props.tableOfContents,
      isEmpty: props.tableOfContents.length === 0,
      activeSectionId,
      activeSectionAncestorIds,
      registerSectionHeading,
      unregisterSectionHeading,
    }),
    [props.tableOfContents, activeSectionId, activeSectionAncestorIds]
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
 * An element is considered _at the window top_, if its top (`offsetTop`)
 * matches the window vertical scroll (`window.scrollY`), and _past the top_ if
 * its top value is smaller than the window's vertical scroll. Some modern
 * browsers, when scrolling an element into view with a top at (for example) y =
 * 20, may scroll the window to a window.scrollY = 19.5, instead of
 * 20. To still consider that element as 'at the top' (offsetTop = scrollY), a
 * slight bias is added via `Math.ceil`.
 */
function isAtOrPastWindowTop(element: HTMLElement) {
  return element.offsetTop <= Math.ceil(window.scrollY)
}

/**
 * Visits all nodes in a tree, invoking the passed callback function on each,
 * with the visited node and its ancestors as arguments.
 */
function visit<T extends { children: Array<T> }>(
  tree: T,
  onVisit: (node: T, ancestors: Array<T>) => void
) {
  const visitRecursively = (
    node: T,
    onVisit: (node: T, ancestors: Array<T>) => void,
    ancestors: Array<T> = []
  ) => {
    onVisit(node, ancestors)
    for (const child of node.children) {
      visitRecursively(child, onVisit, [node, ...ancestors])
    }
  }

  visitRecursively(tree, onVisit, [])
}

export { TableOfContentsProvider, useTableOfContents }

import { Result as TableOfContents } from '@lib/toc'
import * as React from 'react'

type ContextValue = {
  items: TableOfContents
  activeSlug: string | undefined
  registerHeading: (heading: HTMLHeadingElement) => void
  unregisterHeading: (heading: HTMLHeadingElement) => void
}

type Props = {
  tableOfContents: TableOfContents
  children: React.ReactNode
}

const Context = React.createContext<ContextValue | undefined>(undefined)
Context.displayName = 'TableOfContentsContext'

function TableOfContentsProvider(props: Props) {
  const [activeSlug, setActiveSlug] = React.useState<string>('')
  const [headings, setHeadings] = React.useState<Array<HTMLElement>>([])

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

      // If there is no heading at/past the top of the window, the first one
      // still hasn't crossed the top, and is chosen as the active one.
      setActiveSlug(
        firstHeadingAtOrPastTop ? firstHeadingAtOrPastTop.id : firstHeading.id
      )
    }

    // Make a 'manual' first call to compensate that the 'scroll' event is not
    // triggered on load, which would cause to maybe be mid-page (e.g. via
    // opening a ...#some-section link) and have the wrong item as active.
    handleWindowScroll()

    // TODO: handle margins (for nav-bars, etc)
    // TODO: handle other headings as root
    window.addEventListener('scroll', handleWindowScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [headingsSortedByOrderOfAppearance])

  const registerHeading = (heading: HTMLHeadingElement) => {
    setHeadings((headings) => [...headings, heading])
  }

  const unregisterHeading = (heading: HTMLHeadingElement) => {
    setHeadings((headings) => headings.filter((e) => e !== heading))
  }

  const value = React.useMemo<ContextValue>(
    () => ({
      items: props.tableOfContents,
      activeSlug,
      registerHeading,
      unregisterHeading,
    }),
    [activeSlug, props.tableOfContents]
  )

  return <Context.Provider value={value} {...props} />
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

export { TableOfContentsProvider, useTableOfContents }

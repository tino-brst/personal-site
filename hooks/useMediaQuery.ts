import * as React from 'react'
import { isServerSide } from '@lib/constants'

/**
 * Just like using `window.matchMedia(query).matches`, but keeps the returned
 * value up-to-date with any changes.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() =>
    isServerSide ? false : window.matchMedia(query).matches
  )

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = (mediaQuery: MediaQueryListEvent | MediaQueryList) => {
      setMatches(mediaQuery.matches)
    }

    // Call the change handler manually to set the initial value, since it's not
    // automatically called when registering the event listener.
    handleChange(mediaQuery)

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export { useMediaQuery }

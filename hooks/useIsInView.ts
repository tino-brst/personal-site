import * as React from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

// TODO rename to margin (like the observer), and check the positive/negative
// description

type Options = Partial<{
  /**
   * The element/view minimum intersection threshold at which the element is considered in view. Defaults to 0.
   *
   * Examples:
   * ```txt
   * 0   → "In view" as soon as a single pixel enters the view
   * 0.5 → "In view" once half the element enters the view
   * 1   → "In view" once it has completely entered the view
   * ```
   */
  threshold: number
  /**
   * Margins to expand/shrink the size of the reference view (i.e. the
   * viewport). Takes values similar to the CSS margin prop (e.g. "10px 20px
   * 30px 40px"). Positive values shrink the view, negative values expand it.
   */
  viewMargins: string
  /**
   * Makes the returned boolean value sticky. Once it's set to true (i.e.
   * element in view), it stays set to true (even if the element later on gets
   * out of view). Useful for entrance animations that should not run again.
   * Defaults to `false`.
   */
  once: boolean
}>

/**
 * Simply returns a boolean signaling if the given element is in view or not,
 * configurable via threshold and margin values, ala `IntersectionObserver`.
 */
function useIsInView(
  ref: React.RefObject<Element>,
  { threshold = 0, viewMargins, once = false }: Options = {}
): boolean {
  const [isInView, setIsInView] = React.useState(false)
  const [hasBeenInView, setHasBeenInView] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || (once && hasBeenInView)) return

    const callback: IntersectionObserverCallback = ([entry]) => {
      setIsInView(entry.isIntersecting)

      if (once && entry.isIntersecting) {
        setHasBeenInView(true)
      }
    }

    const observer = new IntersectionObserver(callback, {
      threshold,
      rootMargin: viewMargins,
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [viewMargins, ref, threshold, once, hasBeenInView])

  return isInView
}

export { useIsInView }

import React from 'react'

type Options = Partial<{
  /**
   * The element/view minimum intersection threshold at which the element is considered in view. Defaults to 1.
   *
   * Examples:
   * 0   → "In view" as soon as a single pixel enters the view
   * 0.5 → "In view" once half the element enters the view
   * 1   → "In view" once it has completely entered the view
   */
  threshold: number
  /**
   * Margins to expand/shrink the size of the reference view (i.e. the
   * viewport). Takes values similar to the CSS margin prop (e.g. "10px 20px
   * 30px 40px"). Positive values shrink the view, negative values expand it.
   */
  viewMargins: string
}>

/**
 * Simply returns a boolean signaling if the given element is in view or not.
 * With the same (almost) options as an `IntersectionObserver`.
 */
function useIsInView(
  ref: React.RefObject<Element>,
  { threshold = 1, viewMargins }: Options = {}
): boolean {
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    if (!ref.current) return

    const callback: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
      }
    }

    const observer = new IntersectionObserver(callback, {
      threshold,
      rootMargin: viewMargins,
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [viewMargins, ref, threshold])

  return isInView
}

export { useIsInView }

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type Options = Partial<{
  /** Useful to add/remove the handler based on some state (e.g. listen for clicks outside of a modal only while its open). Defaults to true */
  isEnabled: boolean
  /** Event listener options (e.g. `{ passive: true }`) */
  options: AddEventListenerOptions
}>

/**
 * Works just like `window.addEventListener`, without having to do the
 * `useEffect` adding and removing of listeners. Beware of memoizing the
 * callback and options to avoid passing a new handler function / options object
 * on each render.
 */
function useWindowEventListener<T extends keyof WindowEventMap>(
  type: T,
  handler: (this: Window, ev: WindowEventMap[T]) => any,
  { isEnabled = true, options }: Options = {}
) {
  useIsomorphicLayoutEffect(() => {
    if (!isEnabled) return

    window.addEventListener(type, handler, options)

    return () =>
      window.removeEventListener(type, handler, {
        capture: options?.capture,
      })
  }, [type, handler, isEnabled, options])
}

export { useWindowEventListener }

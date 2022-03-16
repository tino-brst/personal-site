import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Works just like `window.addEventListener`, without having to do the `useEffect`
 * adding and removing of listeners. Beware of memoizing the callback to avoid
 * passing a new handler function on each render.
 */
function useWindowEventListener<T extends keyof WindowEventMap>(
  type: T,
  handler: (this: Window, ev: WindowEventMap[T]) => any
) {
  useIsomorphicLayoutEffect(() => {
    window.addEventListener(type, handler)

    return () => window.removeEventListener(type, handler)
  }, [type, handler])
}

export { useWindowEventListener }

import * as React from 'react'

// Make sure the passed function's identity is stable (e.g. via useCallback) and
// not defined in-line (i.e. useDebounce(() => {...})); otherwise, on each render a
// new function will be created and a new debounced function returned from the
// hook, i.e. it will look like the debouncing didn't do anything (even though it
// _did_ debounce a bunch of different functions).

// An excellent debouncing explanation: https://redd.one/blog/debounce-vs-throttle

function useDebounce<T extends (...args: any) => any>(fn: T, duration: number) {
  return React.useMemo(() => debounce(fn, duration), [fn, duration])
}

function debounce<T extends (...args: any) => any>(
  fn: T,
  duration: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      fn(...args)
    }, duration)
  }
}

export { useDebounce }

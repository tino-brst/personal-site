import * as React from 'react'

// Make sure the passed function's identity is stable (e.g. via useCallback) and
// not defined in-line (i.e. useDebounce(() => {...})); otherwise, on each render a
// new function will be created and a new debounced function returned from the
// hook, i.e. it will look like the debouncing didn't do anything (even though it
// _did_ debounce a bunch of different functions).

// An excellent debouncing (vs throttle) explanation:
// https://redd.one/blog/debounce-vs-throttle

const useDebounce: typeof debounce = (fn, duration) => {
  return React.useMemo(() => debounce(fn, duration), [fn, duration])
}

// An implementation of the classic "debounce" function that allows awaiting the
// debounced function, and thus, handling any errors that it may throw (via
// try/catch, etc). A classic case of "this is something that I haven't come
// across or seen anywhere ... is it genius? Or a magnificently bad idea 🤔"
// (probably the latter).

function debounce<T extends (...args: any) => any>(
  fn: T,
  duration: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  // Every call to the returned debounced function shares the following context
  // variables. The timeoutId is the shared timer that all function calls reset,
  // and the pendingPromises array keeps track of the result that should be
  // returned to all calls once the timer goes off.
  let timeoutId: NodeJS.Timeout
  let pendingPromises: Array<{
    resolve: (value: ReturnType<T>) => void
    reject: (reason?: any) => void
  }> = []

  // The debounced function, that takes the same arguments as the original one,
  // but returns a promise that resolves (with the original functions return
  // value) once the timer goes off
  return (...args) => {
    clearTimeout(timeoutId)

    // Store the resolution methods corresponding to each function call in the
    // shared context, to be able to resolve/reject them later, once the timer
    // goes off
    const promise = new Promise<ReturnType<T>>((resolve, reject) => {
      pendingPromises.push({ resolve, reject })
    })

    // Once the timer goes off, we get the function's return value and resolve
    // (or reject if it explodes) all pending promises
    timeoutId = setTimeout(async () => {
      try {
        const result = await fn(...args)
        for (const promise of pendingPromises) {
          promise.resolve(result)
        }
      } catch (error) {
        for (const promise of pendingPromises) {
          promise.reject(error)
        }
      } finally {
        pendingPromises = []
      }
    }, duration)

    return promise
  }
}

export { useDebounce }

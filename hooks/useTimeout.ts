import * as React from 'react'

type ReturnValue = {
  /** Starts the timer. If a timer is in progress, it's cleared and started again (i.e. behaves like a reset) */
  start: () => void
  /** Clears the running timer, if any */
  clear: () => void
}

function useTimeout(
  /** The function to be executed after the timer expires */
  callback: () => void,
  /** The time, in milliseconds that the timer should wait before the specified function is executed */
  delay: number,
  /** Start the timer on mount. Defaults to `true` */
  startOnMount = true
): ReturnValue {
  const savedCallback = React.useRef<() => void>(() => {})
  const savedDelay = React.useRef<number>()
  const savedId = React.useRef<NodeJS.Timeout>()

  savedCallback.current = callback
  savedDelay.current = delay

  React.useEffect(() => {
    if (!startOnMount) return

    const id = setTimeout(savedCallback.current, savedDelay.current)
    savedId.current = id

    return () => clearTimeout(id)
  }, [startOnMount])

  const start = React.useCallback(() => {
    clearTimeout(savedId.current)
    savedId.current = setTimeout(savedCallback.current, savedDelay.current)
  }, [])

  const clear = React.useCallback(() => {
    clearTimeout(savedId.current)
  }, [])

  return {
    start,
    clear,
  }
}

export { useTimeout }

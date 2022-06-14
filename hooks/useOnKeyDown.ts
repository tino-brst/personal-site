import * as React from 'react'
import { useWindowEventListener } from './useWindowEventListener'

function useOnKeyDown(
  /** Key to run the callback function on (same values as KeyboardEvent.key) */
  key: string,
  fn: (event: KeyboardEvent) => void,
  isEnabled = true
) {
  const keyDownHandler = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        fn(event)
      }
    },
    [key, fn]
  )

  useWindowEventListener('keydown', keyDownHandler, { isEnabled })
}

export { useOnKeyDown }

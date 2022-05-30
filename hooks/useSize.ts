import * as React from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type ReturnValue = {
  width: number
  height: number
  isReady: boolean
}

function useSize<T extends HTMLElement>(ref: React.RefObject<T>): ReturnValue {
  const [value, setValue] = React.useState<ReturnValue>({
    width: 0,
    height: 0,
    isReady: false,
  })

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      const target = entries[0].target as T

      setValue({
        width: target.offsetWidth,
        height: target.offsetHeight,
        isReady: true,
      })
    })

    resizeObserver.observe(ref.current)

    setValue({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
      isReady: true,
    })

    return () => resizeObserver.disconnect()
  }, [ref])

  return value
}

export { useSize }

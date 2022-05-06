import * as React from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type Size = {
  width: number
  height: number
}

function useSize<T extends HTMLElement>(ref: React.RefObject<T>): Size {
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 })

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      const borderBoxSize = entries[0].borderBoxSize[0]

      setSize({
        width: borderBoxSize.inlineSize,
        height: borderBoxSize.blockSize,
      })
    })

    resizeObserver.observe(ref.current)

    return () => resizeObserver.disconnect()
  }, [])

  return size
}

export { useSize }

import * as React from 'react'
import { useWindowEventListener } from './useWindowEventListener'

function useOnInteractionOutside(
  refs: React.RefObject<HTMLElement> | Array<React.RefObject<HTMLElement>>,
  fn: () => void,
  isEnabled = true
) {
  const pointerDownHandler = React.useCallback(
    (event: MouseEvent) => {
      const elements = (Array.isArray(refs) ? refs : [refs]).map(
        (ref) => ref.current
      )

      if (
        elements.every(
          (element) => element && isInteractionOutside(element, event)
        )
      ) {
        fn()
      }
    },
    [refs, fn]
  )

  useWindowEventListener('pointerdown', pointerDownHandler, { isEnabled })
}

function isInteractionOutside(
  element: HTMLElement,
  event: MouseEvent
): boolean {
  return !element.contains(event.target as Node)
}

export { useOnInteractionOutside }

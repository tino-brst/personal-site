import * as React from 'react'
import { useWindowEventListener } from './useWindowEventListener'

function useOnInteractionOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  fn: () => void,
  isEnabled = true
) {
  const pointerDownHandler = React.useCallback(
    (event: MouseEvent) => {
      const element = ref.current

      if (!element) return
      if (isInteractionOutside(element, event)) fn()
    },
    [ref, fn]
  )

  useWindowEventListener('pointerdown', pointerDownHandler, isEnabled)
}

function isInteractionOutside(
  element: HTMLElement,
  event: MouseEvent
): boolean {
  return !element.contains(event.target as Node)
}

export { useOnInteractionOutside }

import * as React from 'react'
import { useWindowEventListener } from './useWindowEventListener'

function useOnInteractionOutside<T extends HTMLElement>(
  fn: () => void,
  isEnabled = true
): React.RefObject<T> {
  const ref = React.useRef<T>(null)

  const pointerDownHandler = React.useCallback(
    (event: MouseEvent) => {
      const element = ref.current

      if (!element) return
      if (isInteractionOutside(element, event)) fn()
    },
    [fn]
  )

  useWindowEventListener('pointerdown', pointerDownHandler, isEnabled)

  return ref
}

function isInteractionOutside(
  element: HTMLElement,
  event: MouseEvent
): boolean {
  return !element.contains(event.target as Node)
}

export { useOnInteractionOutside }

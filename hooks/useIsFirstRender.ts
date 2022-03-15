import * as React from 'react'

function useIsFirstRender(): boolean {
  const isFirstRenderRef = React.useRef(true)

  if (isFirstRenderRef.current) {
    isFirstRenderRef.current = false
    return true
  }

  return false
}

export { useIsFirstRender }

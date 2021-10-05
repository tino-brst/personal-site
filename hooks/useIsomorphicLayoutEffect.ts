import * as React from 'react'
import { isServerSide } from '@lib/constants'

// Avoids "useLayoutEffect does nothing on the server" warnings
// https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a

const useIsomorphicLayoutEffect = isServerSide
  ? React.useEffect
  : React.useLayoutEffect

export { useIsomorphicLayoutEffect as useLayoutEffect }

import { useWindowEventListener } from './useWindowEventListener'

const options: AddEventListenerOptions = { passive: true }

function useOnWindowScroll(fn: () => void, isEnabled = true) {
  useWindowEventListener('scroll', fn, { isEnabled, options })
}

export { useOnWindowScroll }

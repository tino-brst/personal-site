import { useLocalStorage } from '@hooks/useLocalStorage'
import { useMediaQuery } from '@hooks/useMediaQuery'
import * as React from 'react'

const themes = ['light', 'dark', 'system'] as const

type ActiveTheme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type ContextValue = {
  active: ActiveTheme
  resolved: ResolvedTheme
  values: typeof themes
  setActive: (value: ActiveTheme) => void
}

type Props = {
  defaultTheme?: ActiveTheme
  storageKey?: string
  children: React.ReactNode
}

const Context = React.createContext<ContextValue | undefined>(undefined)
Context.displayName = 'ThemeContext'

function ThemeProvider({
  defaultTheme = 'system',
  storageKey = 'theme',
  children,
}: Props) {
  const [active, setActive] = useLocalStorage(storageKey, defaultTheme)
  const isSystemThemeDark = useMediaQuery('(prefers-color-scheme: dark)')
  const resolved =
    active === 'system' ? (isSystemThemeDark ? 'dark' : 'light') : active

  React.useEffect(() => {
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [resolved])

  const value = React.useMemo<ContextValue>(
    () => ({
      active,
      resolved,
      values: themes,
      setActive,
    }),
    [active, resolved, setActive]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

function useTheme() {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

export { ThemeProvider, useTheme }
export type { ActiveTheme }

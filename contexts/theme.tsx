import { useLocalStorage } from '@hooks/useLocalStorage'
import { useMediaQuery } from '@hooks/useMediaQuery'
import * as React from 'react'

const themes = ['light', 'dark', 'system'] as const

type ActiveTheme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type ContextValue = {
  /** Active theme */
  active: ActiveTheme
  /** If the active theme is `'system'`, this returns the current system preference (`'light'`/`'dark'`); otherwise, it's the same as `active`. If there are UI elements that change with the theme, this is the value they should follow */
  resolved: ResolvedTheme
  /** List of available themes */
  values: typeof themes
  /** Update the active theme */
  setActive: (value: ActiveTheme) => void
}

type Props = {
  /** Default active theme, used when no theme could be restored from local storage. Defaults to `'system'`. */
  defaultTheme?: ActiveTheme
  /** Local storage key. Used to persist theme info across sessions and sync theme changes across tabs/windows. Defaults to `'theme'` */
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
    // TODO: probably should allow customizing these classes
    // See https://github.com/pacocoursey/next-themes
    // ThemeProvider 'value' prop

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

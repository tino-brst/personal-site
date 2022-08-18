import { useLocalStorage } from '@hooks/useLocalStorage'
import { useMediaQuery } from '@hooks/useMediaQuery'
import * as React from 'react'

const themes = ['light', 'dark', 'system'] as const

type ActiveTheme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type OnToggle = (prevValue: ActiveTheme, newValue: ActiveTheme) => void

type ContextValue = {
  /** Active theme */
  active: ActiveTheme
  /** If the active theme is `system`, this returns the current system preference (`light`/`dark`); otherwise, it's the same as `active`. If there are UI elements that change with the theme, this is the value they should follow */
  resolved: ResolvedTheme
  /** List of available themes */
  values: typeof themes
  /** Update the active theme */
  setActive: (value: ActiveTheme) => void
  /** Cycles through the available themes (light → dark → system → 🔁). Takes a callback to add side-effects to active theme changes. */
  toggle: (onToggle?: OnToggle) => void
}

type Props = {
  /** Default active theme, used when no theme could be restored from local storage. Defaults to `'system'`. */
  defaultTheme?: ActiveTheme
  /** Local storage key. Used to persist theme info across sessions and sync theme changes across tabs/windows. Defaults to `'theme'` */
  storageKey?: string
  children: React.ReactNode
}

// NTH probably should allow customizing these classes
// See https://github.com/pacocoursey/next-themes
// ThemeProvider 'value' prop

const className = {
  darkTheme: 'dark',
  switchingTheme: 'switchingTheme',
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
    // Remove transitions for snappy & consistent theme switching (actually,
    // they are just made instantaneous, not "removed")
    document.documentElement.classList.add(className.switchingTheme)

    // Apply theme
    if (resolved === 'dark') {
      document.documentElement.classList.add(className.darkTheme)
    } else {
      document.documentElement.classList.remove(className.darkTheme)
    }

    // Force restyle
    window.getComputedStyle(document.body)

    // Restore transitions
    setTimeout(() => {
      document.documentElement.classList.remove(className.switchingTheme)
    }, 0)
  }, [resolved])

  const toggle = React.useCallback(
    (onToggle?: OnToggle) => {
      setActive((value) => {
        let newValue: ActiveTheme

        switch (value) {
          case 'light':
            newValue = 'dark'
            break
          case 'dark':
            newValue = 'system'
            break
          case 'system':
            newValue = 'light'
            break
          default:
            throw new Error(`Unknown theme '${value}'.`)
        }

        if (onToggle) {
          onToggle(value, newValue)
        }

        return newValue
      })
    },
    [setActive]
  )

  const value = React.useMemo<ContextValue>(
    () => ({
      active,
      resolved,
      values: themes,
      setActive,
      toggle,
    }),
    [active, resolved, setActive, toggle]
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

import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useNavBar } from 'contexts/nav-bar'
import { useTheme } from 'contexts/theme'
import * as React from 'react'
import { ThemeIcon } from './icons/ThemeIcon'
import { NavButton } from './NavButton'

function ThemeToggle() {
  const theme = useTheme()
  const navBar = useNavBar()

  const [isMounted, setIsMounted] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <NavButton
      onClick={() =>
        theme.toggle((_, newValue) => {
          switch (newValue) {
            case 'light':
              navBar.setStatus('Switched to light theme')
              break
            case 'dark':
              navBar.setStatus('Switched to dark theme')
              break
            case 'system':
              navBar.setStatus(`Matching the system's theme`)
              break
            default:
              break
          }
        })
      }
    >
      {isMounted && (
        <ThemeIcon
          theme={theme.resolved}
          isSystemBased={theme.active === 'system'}
        />
      )}
    </NavButton>
  )
}

export { ThemeToggle }

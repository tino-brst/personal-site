import { useTimeout } from '@hooks/useTimeout'
import * as React from 'react'

type ContextValue = {
  isProgressShown: boolean
  setIsProgressShown: (value: boolean) => void
  progressCompleteThreshold: number
  setProgressCompleteThreshold: (value: number) => void
  isAlwaysOpaque: boolean
  setIsAlwaysOpaque: (value: boolean) => void
  status: string
  setStatus: (value: string) => void
  isStatusShown: boolean
}

type Props = {
  statusTimeoutDuration: number
}

const Context = React.createContext<ContextValue | undefined>(undefined)
Context.displayName = 'NavBarContext'

function NavBarProvider({
  children,
  statusTimeoutDuration,
}: React.PropsWithChildren<Props>) {
  const [isAlwaysOpaque, setIsAlwaysOpaque] = React.useState(false)

  // Progress Bar

  const [isProgressShown, setIsProgressShown] = React.useState(false)
  const [progressCompleteThreshold, setProgressCompleteThreshold] =
    React.useState(Infinity)

  // Status Notifications ('Switched to light theme', 'Copied to clipboard', etc)
  // Probably could be its own StatusContext/useStatus

  const [status, setStatus] = React.useState('')
  const [isStatusShown, setIsStatusShown] = React.useState(false)
  const statusTimeout = useTimeout(
    () => setIsStatusShown(false),
    statusTimeoutDuration,
    false
  )

  const customSetStatus = React.useCallback(
    (value: string) => {
      setStatus(value)
      setIsStatusShown(true)
      statusTimeout.start()
    },
    [statusTimeout]
  )

  const value = React.useMemo<ContextValue>(
    () => ({
      isProgressShown,
      setIsProgressShown,
      progressCompleteThreshold,
      setProgressCompleteThreshold,
      isAlwaysOpaque,
      setIsAlwaysOpaque,
      status,
      setStatus: customSetStatus,
      isStatusShown,
    }),
    [
      customSetStatus,
      isAlwaysOpaque,
      isProgressShown,
      isStatusShown,
      progressCompleteThreshold,
      status,
    ]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

function useNavBar() {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('useNavBar must be used within a NavBarProvider')
  }

  return context
}

export { NavBarProvider, useNavBar }

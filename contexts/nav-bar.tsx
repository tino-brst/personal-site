import * as React from 'react'

type ContextValue = {
  isProgressShown: boolean
  setIsProgressShown: (value: boolean) => void
  progressCompleteThreshold: number
  setProgressCompleteThreshold: (value: number) => void
  isAlwaysOpaque: boolean
  setIsAlwaysOpaque: (value: boolean) => void
}

const Context = React.createContext<ContextValue | undefined>(undefined)
Context.displayName = 'NavBarContext'

function NavBarProvider({ children }: React.PropsWithChildren<{}>) {
  const [isProgressShown, setIsProgressShown] = React.useState(false)
  const [isAlwaysOpaque, setIsAlwaysOpaque] = React.useState(false)
  const [progressCompleteThreshold, setProgressCompleteThreshold] =
    React.useState(Infinity)

  const value = React.useMemo<ContextValue>(
    () => ({
      isProgressShown,
      setIsProgressShown,
      progressCompleteThreshold,
      setProgressCompleteThreshold,
      isAlwaysOpaque,
      setIsAlwaysOpaque,
    }),
    [isAlwaysOpaque, isProgressShown, progressCompleteThreshold]
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

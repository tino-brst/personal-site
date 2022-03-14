import * as React from 'react'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useTheme, ActiveTheme } from 'contexts/theme'

function ThemePicker() {
  const theme = useTheme()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ActiveTheme
    theme.setActive(value)
  }

  const [isMounted, setIsMounted] = React.useState(false)

  // The use of useLayoutEffect makes sure that showing the component is not a
  // two-step process (from the user's perspective). With useEffect it would go
  // like this:
  //
  //   1. First render / mount (returns null).
  //   2. Paint, with the component not shown.
  //   3. Run useEffect (_after_ paint) and set isMounted to true (triggers
  //      update).
  //   4. Second render (returns the component).
  //   5. Paint, _now_ with the component being shown.
  //
  // Which in slo-mo would show no component for a moment, and then the
  // component would appear. With useLayoutEffect (I think):
  //
  //   1. First render / mount (returns null).
  //   2. Run useLayoutEffect (_before_ paint) and set isMounted to true
  //      (triggers update).
  //   3. Second render (returns the component).
  //   4. Paint, with the component being shown.
  //
  // Notice that on the second flow there is no "Paint with no component" step.
  // Getting to the first paint takes a bit longer (due to an "unused" render)
  // but goes straight to the component being shown.
  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="theme">
      <select value={theme.active} onChange={handleChange}>
        {theme.values.map((theme) => (
          <option value={theme} onChange={console.log} key={theme}>
            {theme}
          </option>
        ))}
      </select>
      {theme.active !== theme.resolved && (
        <span className={'theme-resolved'}>({theme.resolved})</span>
      )}
    </div>
  )
}

export { ThemePicker }

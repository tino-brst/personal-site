import * as React from 'react'
import styled from 'styled-components'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useTheme } from 'contexts/theme'
import { Half2Icon } from '@radix-ui/react-icons'

function ThemeToggle() {
  const theme = useTheme()

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
    <Button onClick={theme.toggle}>
      <Half2Icon
        width={21}
        height={21}
        style={{ transform: 'rotate(45deg)' }}
      />
    </Button>
  )
}

// TODO: extract styles to shared NavButton component? (both tray and theme buttons look the same)

const Button = styled.button`
  cursor: pointer;
  color: black;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  transition-property: background-color, transform;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.05);
  }

  &:active {
    transform: scale(0.9);
  }
`

export { ThemeToggle }

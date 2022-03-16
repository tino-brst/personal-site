import * as React from 'react'
import styled from 'styled-components'
import { animated, SpringConfig, SpringValue, useSpring } from 'react-spring'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useSize } from '@hooks/useSize'
import { useWindowEventListener } from '@hooks/useWindowEventListener'
import { useIsFirstRender } from '@hooks/useIsFirstRender'

// TODO: media queries

const navBarHeight = 40
const navBarThreshold = 20

const springConfig: SpringConfig = { mass: 0.5, tension: 300, friction: 16 }
const scrollY = new SpringValue(0)
const scrollBasedOpacity = [[0, navBarThreshold], [0, 1], 'clamp'] as const
const backgroundOpacity = new SpringValue({
  to: scrollY.to(...scrollBasedOpacity),
  immediate: true,
  config: springConfig,
})

function NavBar() {
  const isFirstRender = useIsFirstRender()
  const [isOpen, setIsOpen] = React.useState(false)
  const [trayRef, { height: trayHeight }] = useSize<HTMLDivElement>()

  useWindowEventListener('scroll', setScrollY)

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      // The tray is opening
      // Animate from the current scroll based opacity to fully opaque
      backgroundOpacity.start(1)
    } else if (!isFirstRender) {
      // The tray is closing
      // Animate from fully opaque to the current scroll based opacity
      backgroundOpacity.start({
        to: scrollY.to(...scrollBasedOpacity),
        onRest: (animationResult, springValue) => {
          // If the animation's resolution (onResolve call) is premature (i.e.
          // finished === false), due to a reopening of the menu while it was
          // closing, then skip the immediate update, and let the animation
          // towards 'open' that canceled this one take the wheel.
          if (!animationResult.finished) return

          springValue.start({
            to: scrollY.to(...scrollBasedOpacity),
            immediate: true,
          })
        },
      })
    }
  }, [isOpen])

  const { height } = useSpring({
    height: navBarHeight + (isOpen ? trayHeight : 0),
    config: springConfig,
  })

  return (
    <StickyPlaceholder>
      <Wrapper style={{ height }}>
        <Background style={{ opacity: backgroundOpacity }} />
        <Bar>
          <button onClick={() => setIsOpen((value) => !value)}>
            toggle tray
          </button>
        </Bar>
        <Tray ref={trayRef}>{/* Home, Writing, About */}</Tray>
      </Wrapper>
    </StickyPlaceholder>
  )
}

function setScrollY() {
  console.log('scroll')
  scrollY.set(window.scrollY)
}

const StickyPlaceholder = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: ${navBarHeight}px;
`

const Wrapper = styled(animated.div)`
  position: relative;
  overflow: hidden;
`

const Background = styled(animated.div)`
  position: absolute;
  z-index: -1;
  inset: 0;
  background: hsla(0 0% 0% / 0.1);
`

const Bar = styled.div`
  height: ${navBarHeight}px;
`

const Tray = styled.div`
  height: 100px;
`

export { NavBar }

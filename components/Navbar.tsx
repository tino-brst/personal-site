import * as React from 'react'
import styled from 'styled-components'
import { animated, SpringConfig, SpringValue, useSpring } from 'react-spring'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useSize } from '@hooks/useSize'
import { useWindowEventListener } from '@hooks/useWindowEventListener'
import { useIsFirstRender } from '@hooks/useIsFirstRender'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'

// TODO: media queries

const barHeight = 40
const scrollThreshold = 20

const springConfig: SpringConfig = { mass: 0.5, tension: 300, friction: 16 }
const scrollY = new SpringValue(0)
const scrollBasedOpacity = [[0, scrollThreshold], [0, 1], 'clamp'] as const
const backgroundOpacity = new SpringValue({
  to: scrollY.to(...scrollBasedOpacity),
  immediate: true,
  config: springConfig,
})

function NavBar() {
  const isFirstRender = useIsFirstRender()
  const [isTrayOpen, setIsTrayOpen] = React.useState(false)
  const [trayRef, { height: trayHeight }] = useSize<HTMLDivElement>()
  const { height } = useSpring({
    height: barHeight + (isTrayOpen ? trayHeight : 0),
    config: springConfig,
  })

  // Keep the scrollY spring up-to-date with scroll changes

  const setScrollY = React.useCallback(() => {
    scrollY.set(window.scrollY)
  }, [])

  useWindowEventListener('scroll', setScrollY)

  // Close the tray when clicking outside of the bar/tray or scrolling the page

  const closeTray = React.useCallback(() => {
    setIsTrayOpen(false)
  }, [])

  useWindowEventListener('scroll', closeTray)

  const wrapperRef = useOnInteractionOutside<HTMLDivElement>(
    closeTray,
    isTrayOpen
  )

  // Background opacity animations

  useIsomorphicLayoutEffect(() => {
    // Skip animations on load. If the page loads scrolled to a #section
    // mid-document, no need to fade-in the background.
    if (isFirstRender) return

    if (isTrayOpen) {
      // The tray is opening
      // Animate from the current scroll based opacity to fully opaque
      backgroundOpacity.start(1)
    } else {
      // The tray is closing
      // Animate from fully opaque to the current scroll based opacity
      backgroundOpacity.start({
        to: scrollY.to(...scrollBasedOpacity),
        onRest: (animationResult, springValue) => {
          // If the animation didn't get to finish when calling its onRest
          // callback, it means that something else interrupted it, and we
          // should let that something take the wheel, aborting whatever the
          // onRest callback was about to do. That something else is the opening
          // animation that may trigger mid-closing if we toggle the menu
          // quickly enough.
          if (!animationResult.finished) return

          springValue.start({
            to: scrollY.to(...scrollBasedOpacity),
            immediate: true,
          })
        },
      })
    }
  }, [isFirstRender, isTrayOpen])

  return (
    <StickyPlaceholder>
      <Wrapper style={{ height }} ref={wrapperRef}>
        <Background style={{ opacity: backgroundOpacity }} />
        <Bar>
          <button onClick={() => setIsTrayOpen((value) => !value)}>
            toggle tray
          </button>
        </Bar>
        <Tray ref={trayRef}>{/* Home, Writing, About */}</Tray>
      </Wrapper>
    </StickyPlaceholder>
  )
}

const StickyPlaceholder = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: ${barHeight}px;
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
  height: ${barHeight}px;
`

const Tray = styled.div`
  height: 100px;
`

export { NavBar }

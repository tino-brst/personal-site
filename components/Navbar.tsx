import * as React from 'react'
import styled from 'styled-components'
import { animated, config, SpringValue, useSpring } from 'react-spring'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'

const navBarHeight = 40
const scrollY = new SpringValue(0)

function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false)

  //#region useSize

  const trayElementRef = React.useRef<HTMLDivElement>(null)
  const [{ height: trayMaxHeight }, setSize] = React.useState({
    width: 0,
    height: 0,
  })

  React.useLayoutEffect(() => {
    if (!trayElementRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setSize({ width, height })
    })

    resizeObserver.observe(trayElementRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  //#endregion

  //#region Background opacity

  const [{ opacity }, opacityAnimation] = useSpring(() => ({
    opacity: scrollY.to([0, 20], [0, 1], 'clamp'),
    immediate: true,
    config: config.wobbly,
  }))

  useIsomorphicLayoutEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY)

    document.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      // The tray is opening
      // Animate from the current scroll based opacity to fully opaque
      opacityAnimation.start({ opacity: 1 })
    } else {
      // The tray is closing
      // Animate from fully opaque to the current scroll based opacity
      opacityAnimation.start({
        opacity: scrollY.to([0, 20], [0, 1], 'clamp'),
        onResolve: (animationResult, controller) => {
          // If the animation's resolution (onResolve call) is premature (i.e.
          // finished === false), due to a reopening of the menu while it was
          // closing, then skip the immediate update, and let the animation
          // towards 'open' that canceled this one take the wheel.
          if (!animationResult.finished) return

          controller.start({
            opacity: scrollY.to([0, 20], [0, 1], 'clamp'),
            immediate: true,
          })
        },
      })
    }
  }, [isOpen, opacityAnimation, opacity])

  //#endregion

  //#region Tray height

  const [{ height: trayHeight }, heightAnimation] = useSpring(() => ({
    height: 0,
    config: config.wobbly,
  }))

  React.useLayoutEffect(() => {
    heightAnimation.start({ height: isOpen ? trayMaxHeight : 0 })
  }, [trayMaxHeight, isOpen, heightAnimation])

  //#endregion

  return (
    <StickyPlaceholder>
      <Wrapper>
        <Background style={{ opacity }} />
        <Bar>
          <button onClick={() => setIsOpen((value) => !value)}>
            toggle tray
          </button>
        </Bar>
        <TrayWrapper style={{ height: trayHeight }}>
          <Tray ref={trayElementRef}>{/* Home, Writing, About */}</Tray>
        </TrayWrapper>
      </Wrapper>
    </StickyPlaceholder>
  )
}

const StickyPlaceholder = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: ${navBarHeight}px;
`

const Wrapper = styled.div`
  position: relative;
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

const TrayWrapper = styled(animated.div)`
  overflow: hidden;
`

const Tray = styled.div`
  height: 100px;
`

export { NavBar }

import * as React from 'react'
import styled from 'styled-components'
import NextLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { map } from '@lib/math'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useSize } from '@hooks/useSize'
import { useWindowEventListener } from '@hooks/useWindowEventListener'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'
import { ThemeToggle } from './ThemeToggle'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { NavGroup, NavGroupLink } from './NavGroup'
import avatarImageSrc from 'public/images/avatar.png'
import clsx from 'clsx'

const barHeight = 70
const scrollThreshold = 48

const cssVar = {
  scrollBasedOpacity: '--scroll-based-opacity',
  trayHeight: '--tray-height',
}

function NavBar() {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const backgroundRef = React.useRef<HTMLDivElement>(null)
  const trayRef = React.useRef<HTMLDivElement>(null)

  const [isTrayOpen, setIsTrayOpen] = React.useState(false)
  const traySize = useSize(trayRef)

  // Initialize scroll based opacity CSS var & keep up-to-date with scroll
  // changes (not set in inline styles to avoid re-renders with each scroll
  // event)

  useIsomorphicLayoutEffect(() => {
    backgroundRef.current?.style.setProperty(
      cssVar.scrollBasedOpacity,
      `${map(window.scrollY, [0, scrollThreshold], [0, 1])}`
    )
  }, [])

  const updateScrollBasedOpacity = React.useCallback(() => {
    backgroundRef.current?.style.setProperty(
      cssVar.scrollBasedOpacity,
      `${map(window.scrollY, [0, scrollThreshold], [0, 1])}`
    )
  }, [])

  useWindowEventListener('scroll', updateScrollBasedOpacity)

  // Handle switching the background's opacity changes from instant (while
  // scrolling) to animated (when opening/closing the tray). Accomplished via
  // toggling the CSS prop transition-property between 'opacity' and 'none'.

  useIsomorphicLayoutEffect(() => {
    const background = backgroundRef.current

    if (!background) return

    // By default, the background's opacity has no transitions. Whenever there
    // is a change due to scrolling, it's applied immediately. But when the tray
    // is opening/closing, there _should_ be a transition, and thus the
    // opacity's transition is enabled.
    if (isTrayOpen) {
      background.style.transitionProperty = 'opacity'
    }

    // When the tray is closing, wait for the transition to end, and restore the
    // opacity to having no animations, and thus apply scroll changes
    // immediately.
    // TODO: attach to onTransitionEnd?
    if (!isTrayOpen) {
      const transitionEndHandler = () => {
        background.style.transitionProperty = 'none'
      }

      background.addEventListener('transitionend', transitionEndHandler)

      return () =>
        background.removeEventListener('transitionend', transitionEndHandler)
    }
  }, [isTrayOpen])

  // Close the tray when clicking outside of the bar/tray or scrolling the page

  const closeTray = React.useCallback(() => {
    setIsTrayOpen(false)
  }, [])

  useWindowEventListener('scroll', closeTray)
  useOnInteractionOutside(wrapperRef, closeTray, isTrayOpen)

  return (
    <StickyPlaceholder>
      <Wrapper ref={wrapperRef} isTrayOpen={isTrayOpen}>
        <Background ref={backgroundRef} isTrayOpen={isTrayOpen} />
        <Bar>
          <NextLink href="/" passHref={true}>
            <HomeLink>
              <AvatarImage
                src={avatarImageSrc}
                height={46}
                width={46}
                alt="Tino's Memoji"
              />
              Tino&apos;s Corner
            </HomeLink>
          </NextLink>
          <BarEnd>
            <NavGroup>
              <NavGroupLink to="/" exact>
                Home
              </NavGroupLink>
              <NavGroupLink to="/writing">Writing</NavGroupLink>
              <NavGroupLink to="/about">About</NavGroupLink>
            </NavGroup>
            <ThemeToggle />
            <TrayButton onClick={() => setIsTrayOpen((value) => !value)}>
              <HamburgerMenuIcon width={23} height={23} />
            </TrayButton>
          </BarEnd>
        </Bar>
        <TrayWrapper
          isTrayOpen={isTrayOpen}
          style={{ [cssVar.trayHeight]: `${traySize.height}px` }}
        >
          <Tray ref={trayRef}>
            {/* TODO: trap-focus on menu items (and toggle) while menu is open */}
            {/* TODO: remove from tab-index, aria hidden, etc */}
            {/* TODO: cascade animation for each item? */}
            <TrayLink to="/" onClick={closeTray} exact>
              Home
            </TrayLink>
            <TrayLink to="/writing" onClick={closeTray}>
              Writing
            </TrayLink>
            <TrayLink to="/about" onClick={closeTray}>
              About
            </TrayLink>
          </Tray>
        </TrayWrapper>
      </Wrapper>
    </StickyPlaceholder>
  )
}

function TrayLink(props: {
  to: string
  onClick: () => void
  /** When true, the active style will only be applied if the location is matched _exactly_. */
  exact?: boolean
  children?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <NextLink href={props.to} passHref={true}>
      <Link
        onClick={props.onClick}
        className={clsx({
          active: props.exact
            ? router.pathname === props.to
            : router.pathname.startsWith(props.to),
        })}
      >
        {props.children}
      </Link>
    </NextLink>
  )
}

const StickyPlaceholder = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: ${barHeight}px;
  margin-bottom: ${scrollThreshold}px;
  z-index: 1;
`

const Wrapper = styled.div<{ isTrayOpen: boolean }>`
  position: relative;
  box-shadow: ${(p) =>
    p.isTrayOpen
      ? '0px 0px 4px rgba(0, 0, 0, 0.01), 0px 4px 60px rgba(0, 0, 0, 0.05)'
      : null};

  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s;

  @media (min-width: 640px) {
    box-shadow: none;
  }
`

const Background = styled.div<{ isTrayOpen: boolean }>`
  opacity: ${(p) => (p.isTrayOpen ? 1 : `var(${cssVar.scrollBasedOpacity})`)};
  position: absolute;
  z-index: -1;
  inset: 0;
  background: hsla(0 0% 100% / 0.88);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0 1px hsla(0 0% 0% / 0.05);

  transition-property: none;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s;

  @media (min-width: 640px) {
    opacity: var(${cssVar.scrollBasedOpacity});
  }
`

const Bar = styled.div`
  height: ${barHeight}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
  max-width: calc(768px + 2 * 16px);
  gap: 20px;
`

const HomeLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: black;
`

const AvatarImage = styled(Image)`
  border-radius: 50%;
  background-color: hsla(0 0% 0% / 0.05);
`

const BarEnd = styled.div`
  display: flex;
  gap: 12px;
`

const TrayButton = styled.button`
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;

  transition-property: background-color, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.03);
  }

  &:active {
    transform: scale(0.94);
  }

  @media (min-width: 640px) {
    display: none;
  }
`

const TrayWrapper = styled.div<{ isTrayOpen: boolean }>`
  overflow: hidden;
  max-height: ${(p) => (p.isTrayOpen ? `var(${cssVar.trayHeight})` : 0)};
  opacity: ${(p) => (p.isTrayOpen ? 1 : 0)};
  transform: ${(p) => (p.isTrayOpen ? null : 'translateY(-8px) scale(0.8)')};

  transition-property: max-height, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s, 0.2s, 0.15s;

  @media (min-width: 640px) {
    max-height: 0;
  }
`

const Tray = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 12px;
  padding-bottom: 24px;
`

const Link = styled.a`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 12px 18px;
  color: hsla(0 0% 0% / 0.4);

  transition-property: background-color, transform, color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.03);
  }

  &:active {
    transform: scale(0.95);
  }

  &.active {
    color: black;
  }
`

export { NavBar }

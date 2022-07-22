import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'
import { useOnWindowScroll } from '@hooks/useOnWindowScroll'
import { useSize } from '@hooks/useSize'
import { map } from '@lib/math'
import clsx from 'clsx'
import { useNavBar } from 'contexts/nav-bar'
import { useTheme } from 'contexts/theme'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import avatarImageSrc from 'public/images/avatar.png'
import * as React from 'react'
import styled from 'styled-components'
import { MenuIcon } from './icons/MenuIcon'
import { ThemeIcon } from './icons/ThemeIcon'
import { NavGroup, NavGroupLink } from './NavGroup'

const barHeight = 70
const scrollThreshold = 48

const cssVar = {
  scrollBasedOpacity: '--scroll-based-opacity',
  menuHeight: '--menu-height',
}

function NavBar() {
  const theme = useTheme()
  const settings = useNavBar()

  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const backgroundRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuSize = useSize(menuRef)

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

  useOnWindowScroll(updateScrollBasedOpacity)

  // Handle switching the background's opacity changes from instant (while
  // scrolling) to animated (when opening/closing the menu). Accomplished via
  // toggling the CSS prop transition-property between 'opacity' and 'none'.

  useIsomorphicLayoutEffect(() => {
    const background = backgroundRef.current

    if (!background) return

    // By default, the background's opacity has no transitions. Whenever there
    // is a change due to scrolling, it's applied immediately. But when the menu
    // is opening/closing, there _should_ be a transition, and thus the
    // opacity's transition is enabled.
    if (isMenuOpen) {
      background.style.transitionProperty = 'opacity'
    }

    // When the menu is closing, wait for the transition to end, and restore the
    // opacity to having no animations, and thus apply scroll changes
    // immediately.
    // TODO: attach to onTransitionEnd?
    if (!isMenuOpen) {
      const transitionEndHandler = () => {
        background.style.transitionProperty = 'none'
      }

      background.addEventListener('transitionend', transitionEndHandler)

      return () =>
        background.removeEventListener('transitionend', transitionEndHandler)
    }
  }, [isMenuOpen])

  // Close the menu when clicking outside of the bar/menu or scrolling the page

  const closeMenu = React.useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  useOnWindowScroll(closeMenu)
  useOnInteractionOutside(wrapperRef, closeMenu, isMenuOpen)

  // Progress Bar

  const progressBarRef = React.useRef<HTMLDivElement>(null)
  const [isProgressComplete, setIsProgressComplete] = React.useState(false)

  const updateProgress = React.useCallback(() => {
    if (!progressBarRef.current) return

    const threshold = Math.min(
      document.documentElement.scrollHeight - window.innerHeight,
      settings.progressCompleteThreshold - barHeight
    )

    const progress = map(window.scrollY, [0, threshold], [0, 1])

    progressBarRef.current.style.setProperty('--progress', `${progress}`)

    setIsProgressComplete(progress === 1)
  }, [settings.progressCompleteThreshold])

  useOnWindowScroll(updateProgress)

  // Used to avoid client/server render miss-matches, skipping those things for
  // which the rendered result depends on client info (e.g. the theme toggle)

  const [isMounted, setIsMounted] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <StickyPlaceholder />
      <Root
        ref={wrapperRef}
        className={clsx({
          menuOpen: isMenuOpen,
        })}
      >
        <Background
          ref={backgroundRef}
          className={clsx({
            opaque: settings.isAlwaysOpaque,
            menuOpen: isMenuOpen,
          })}
        />
        <ProgressBar
          ref={progressBarRef}
          className={clsx({
            visible: settings.isProgressShown,
            complete: isProgressComplete,
          })}
        />
        <Content>
          <NextLink href="/" passHref>
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
            {isMounted && (
              <NavButton onClick={theme.toggle}>
                <ThemeIcon
                  theme={theme.resolved}
                  isSystemBased={theme.active === 'system'}
                />
              </NavButton>
            )}
            <MenuToggle onClick={() => setIsMenuOpen((value) => !value)}>
              <MenuIcon isOpen={isMenuOpen} />
            </MenuToggle>
          </BarEnd>
        </Content>
        <MenuWrapper
          className={clsx({ menuOpen: isMenuOpen })}
          style={{ [cssVar.menuHeight]: `${menuSize.height}px` }}
        >
          <Menu ref={menuRef}>
            {/* TODO: trap-focus on menu items (and toggle) while menu is open */}
            {/* TODO: remove from tab-index, aria hidden, etc */}
            {/* TODO: cascade animation for each item? */}
            <MenuLink href="/" onClick={closeMenu} exact>
              Home
            </MenuLink>
            <MenuLink href="/writing" onClick={closeMenu}>
              Writing
            </MenuLink>
            <MenuLink href="/about" onClick={closeMenu}>
              About
            </MenuLink>
          </Menu>
        </MenuWrapper>
      </Root>
    </>
  )
}

function MenuLink(props: {
  href: string
  onClick: () => void
  /** When true, the active style will only be applied if the location is matched _exactly_. */
  exact?: boolean
  children?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <NextLink href={props.href} passHref>
      <Link
        onClick={props.onClick}
        className={clsx({
          active: props.exact
            ? router.pathname === props.href
            : router.pathname.startsWith(props.href),
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
`

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;

  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s;

  &.menuOpen {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.01),
      0px 4px 60px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    box-shadow: none;
  }
`

const Background = styled.div`
  opacity: var(${cssVar.scrollBasedOpacity});
  position: absolute;
  z-index: -1;
  inset: 0;
  background: var(--color-bg-translucent);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0 1px var(--color-shadow-border),
    inset 0 -0.5px 0 var(--color-shadow-border-contrast),
    inset 0 0.5px 0 var(--color-border-top-navbar);

  transition-property: none;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s;

  &.menuOpen {
    opacity: 1;
  }

  &.opaque {
    opacity: 1;
  }

  @media (min-width: 640px) {
    opacity: var(${cssVar.scrollBasedOpacity});

    &.opaque {
      opacity: 1;
    }
  }
`

const ProgressBar = styled.div`
  --height: 3px;
  --progress: 0;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--height);
  background: var(--color-progress-bar);
  transform: scaleX(var(--progress));
  transform-origin: left;
  display: none;

  transition-property: opacity, top;
  transition-duration: 0.4s;

  &.visible {
    display: revert;
  }

  &.complete {
    top: calc(-1 * var(--height));
    opacity: 0;
  }
`

const Content = styled.div`
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

  @media (min-width: 640px) {
    padding-right: 32px;
    padding-left: 32px;
  }
`

const HomeLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-fg-accent);
`

const AvatarImage = styled(Image)`
  border-radius: 50%;
  background-color: var(--color-bg-muted);
`

const BarEnd = styled.div`
  display: flex;
  gap: 12px;
`

const NavButton = styled.button`
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--color-fg-accent);

  transition-property: background-color, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: var(--color-bg-subtle);
  }

  &:active {
    transform: scale(0.94);
  }
`

const MenuToggle = styled(NavButton)`
  @media (min-width: 640px) {
    display: none;
  }
`

const MenuWrapper = styled.div`
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px) scale(0.8);

  transition-property: max-height, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s, 0.2s, 0.15s;

  &.menuOpen {
    max-height: var(${cssVar.menuHeight});
    opacity: 1;
    transform: none;
  }

  @media (min-width: 640px) {
    max-height: 0;
  }
`

const Menu = styled.div`
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
  color: var(--color-fg-default);

  transition-property: background-color, transform, color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: var(--color-bg-subtle);
  }

  &:active {
    transform: scale(0.95);
  }

  &.active {
    color: var(--color-fg-accent);
  }
`

export { NavBar }

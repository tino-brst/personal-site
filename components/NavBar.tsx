import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'
import { useOnWindowScroll } from '@hooks/useOnWindowScroll'
import { useSize } from '@hooks/useSize'
import { Page } from '@lib/constants'
import { map } from '@lib/math'
import clsx from 'clsx'
import { useNavBar } from 'contexts/nav-bar'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import avatarImageSrc from 'public/images/avatar.png'
import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { MenuIcon } from './icons/MenuIcon'
import { NavButton } from './NavButton'
import { NavGroup, NavGroupLink } from './NavGroup'
import { NavMenuLink } from './NavMenuLink'
import { ThemeToggle } from './ThemeToggle'

const height = 70
const marginBottom = 48

const CSSVar = {
  scrollBasedOpacity: '--scroll-based-opacity',
  menuHeight: '--menu-height',
} as const

function NavBar() {
  const router = useRouter()
  const navBar = useNavBar()

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
      CSSVar.scrollBasedOpacity,
      `${map(window.scrollY, [0, marginBottom], [0, 1])}`
    )
  }, [])

  const updateScrollBasedOpacity = React.useCallback(() => {
    backgroundRef.current?.style.setProperty(
      CSSVar.scrollBasedOpacity,
      `${map(window.scrollY, [0, marginBottom], [0, 1])}`
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
      navBar.progressCompleteThreshold - height
    )

    const progress = map(window.scrollY, [0, threshold], [0, 1])

    progressBarRef.current.style.setProperty('--progress', `${progress}`)

    setIsProgressComplete(progress === 1)
  }, [navBar.progressCompleteThreshold])

  useOnWindowScroll(updateProgress)

  // Used to postpone showing client-context dependent content & avoid
  // client/server render miss-matches (e.g. the theme toggle, the nav bar and
  // its position based opacity, etc)

  const [isMounted, setIsMounted] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <RootPlaceholder>
      <Root
        ref={wrapperRef}
        className={clsx({
          menuOpen: isMenuOpen,
          ready: isMounted,
        })}
      >
        <Status className={clsx({ visible: navBar.isStatusShown })}>
          {navBar.status}
        </Status>
        <Background
          ref={backgroundRef}
          className={clsx({
            opaque: navBar.isAlwaysOpaque,
            menuOpen: isMenuOpen,
          })}
        />
        <ProgressBar
          ref={progressBarRef}
          className={clsx({
            visible: navBar.isProgressShown,
            complete: isProgressComplete,
          })}
        />
        <Content>
          <NextLink href={Page.home} passHref>
            <HomeLink>
              <AvatarImageWrapper>
                <NextImage
                  src={avatarImageSrc}
                  layout="fill"
                  alt="Tino's Memoji"
                />
              </AvatarImageWrapper>
              Tino&apos;s Corner
            </HomeLink>
          </NextLink>
          <BarEnd>
            <NavGroup>
              <NavGroupLink href={Page.home} exact>
                Home
              </NavGroupLink>
              <NavGroupLink href={Page.writing}>Writing</NavGroupLink>
              <NavGroupLink href={Page.about}>About</NavGroupLink>
            </NavGroup>
            <ThemeToggle />
            <MenuToggle onClick={() => setIsMenuOpen((value) => !value)}>
              <MenuIcon isOpen={isMenuOpen} />
            </MenuToggle>
          </BarEnd>
        </Content>
        <MenuWrapper
          className={clsx({ menuOpen: isMenuOpen })}
          style={{ [CSSVar.menuHeight]: `${menuSize.height}px` }}
        >
          <Menu ref={menuRef}>
            <NavMenuLink
              exact
              href={Page.home}
              currentPath={router.pathname}
              onClick={closeMenu}
            >
              Home
            </NavMenuLink>
            <NavMenuLink
              href={Page.writing}
              currentPath={router.pathname}
              onClick={closeMenu}
            >
              Writing
            </NavMenuLink>
            <NavMenuLink
              href={Page.about}
              currentPath={router.pathname}
              onClick={closeMenu}
            >
              About
            </NavMenuLink>
          </Menu>
        </MenuWrapper>
      </Root>
    </RootPlaceholder>
  )
}

const RootPlaceholder = styled.div`
  height: ${height}px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`

const navBarEnter = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: none;
  }
`

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  visibility: hidden;

  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.01), 0px 0px 80px rgba(0, 0, 0, 0.1);

    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
    transition-duration: 0.2s;
  }

  &.menuOpen::before {
    opacity: 1;
  }

  &.ready {
    visibility: visible;
    animation: ${navBarEnter} cubic-bezier(0.4, 0, 0.25, 1) 0.6s backwards;
  }

  @media (min-width: 640px) {
    &::before {
      display: none;
    }
  }
`

const Status = styled.div`
  position: absolute;
  top: calc(100% + 16px);
  left: 0;
  right: 0;
  width: fit-content;
  margin: auto;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  color: var(--color-fg-status);
  background-color: var(--color-bg-status);
  backdrop-filter: saturate(180%) blur(10px);
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
  transform-origin: center top;
  box-shadow: var(--shadow-status);

  transition-property: transform, opacity, width;
  transition-duration: 0.2s !important;

  &.visible {
    opacity: 1;
    transform: none;
  }
`

const Background = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: var(${CSSVar.scrollBasedOpacity});
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
    &.menuOpen {
      opacity: var(${CSSVar.scrollBasedOpacity});
    }

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

const contentEnter = keyframes`
  from {
    opacity: 0.6;
    transform: scale(.95);
  }
  to {
    opacity: 1;
    transform: none;
  }
`

const Content = styled.div`
  height: ${height}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
  max-width: calc(768px + 2 * 16px);
  gap: 20px;

  ${Root}.ready & {
    animation: ${contentEnter} cubic-bezier(0.4, 0, 0.25, 1) 1s backwards;
  }

  @media (min-width: 640px) {
    padding-right: 32px;
    padding-left: 32px;
  }
`

const HomeLink = styled.a`
  --avatar-size: 46px;

  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 8px;
  line-height: 1;
  font-size: 18px;
  font-weight: 500;
  border-radius: calc(var(--avatar-size) / 2);
  color: var(--color-fg-accent);

  --focus-inset: -2px;
  --focus-radius: calc(var(--avatar-size) / 2 + 2px);

  ${focusRing}
`

const AvatarImageWrapper = styled.div`
  position: relative;
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  background-color: var(--color-bg-muted);
`

const BarEnd = styled.div`
  display: flex;
  gap: 12px;
`

const MenuToggle = styled(NavButton)`
  @media (min-width: 640px) {
    display: none;
  }
`

const MenuWrapper = styled.div`
  visibility: hidden;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: scale(0.8);
  transform-origin: top center;

  transition-property: max-height, transform, opacity, visibility;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s, 0.2s, 0.15s, 0.2s;

  &.menuOpen {
    visibility: visible;
    max-height: var(${CSSVar.menuHeight});
    opacity: 1;
    transform: none;
  }

  @media (min-width: 640px) {
    &.menuOpen {
      visibility: hidden;
      max-height: 0;
      opacity: 0;
      transform: scale(0.8);
    }
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

NavBar.height = height
NavBar.marginBottom = marginBottom

export { NavBar }

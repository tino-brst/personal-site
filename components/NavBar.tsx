import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useOnInteractionOutside } from '@hooks/useOnInteractionOutside'
import { useOnWindowScroll } from '@hooks/useOnWindowScroll'
import { useSize } from '@hooks/useSize'
import { map } from '@lib/math'
import clsx from 'clsx'
import { useNavBar } from 'contexts/nav-bar'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import avatarImageSrc from 'public/images/avatar.png'
import * as React from 'react'
import styled from 'styled-components'
import { MenuIcon } from './icons/MenuIcon'
import { NavGroup, NavGroupLink } from './NavGroup'
import { ThemeToggle } from './ThemeToggle'

// TODO switch to classes instead of props

const barHeight = 70
const scrollThreshold = 48

const cssVar = {
  scrollBasedOpacity: '--scroll-based-opacity',
  menuHeight: '--menu-height',
}

function NavBar() {
  const { isProgressShown, isAlwaysOpaque, progressCompleteThreshold } =
    useNavBar()

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
      progressCompleteThreshold - barHeight
    )

    const progress = map(window.scrollY, [0, threshold], [0, 1])

    progressBarRef.current.style.setProperty('--progress', `${progress}`)

    setIsProgressComplete(progress === 1)
  }, [progressCompleteThreshold])

  useOnWindowScroll(updateProgress)

  return (
    <StickyPlaceholder>
      <Wrapper ref={wrapperRef} isMenuOpen={isMenuOpen}>
        <Background
          ref={backgroundRef}
          isMenuOpen={isMenuOpen}
          className={clsx({ opaque: isAlwaysOpaque })}
        />
        <ProgressBar
          ref={progressBarRef}
          className={clsx({
            visible: isProgressShown,
            complete: isProgressComplete,
          })}
        />
        <Bar>
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
            <ThemeToggle />
            <MenuToggle onClick={() => setIsMenuOpen((value) => !value)}>
              <MenuIcon isOpen={isMenuOpen} />
            </MenuToggle>
          </BarEnd>
        </Bar>
        <MenuWrapper
          isMenuOpen={isMenuOpen}
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
      </Wrapper>
    </StickyPlaceholder>
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
  z-index: 1;
`

const Wrapper = styled.div<{ isMenuOpen: boolean }>`
  position: relative;
  box-shadow: ${(p) =>
    p.isMenuOpen
      ? '0px 0px 4px rgba(0, 0, 0, 0.01), 0px 4px 60px rgba(0, 0, 0, 0.05)'
      : null};

  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s;

  @media (min-width: 640px) {
    box-shadow: none;
  }
`

const Background = styled.div<{ isMenuOpen: boolean }>`
  opacity: ${(p) => (p.isMenuOpen ? 1 : `var(${cssVar.scrollBasedOpacity})`)};
  position: absolute;
  z-index: -1;
  inset: 0;
  background: hsla(0 0% 100% / 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0 1px hsla(0 0% 0% / 0.05), inset 0 0.5px 0 hsla(0 0% 0% / 0.08);

  transition-property: none;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s;

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
  background: hsla(0deg 0% 0% / 0.1);
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

const NavButton = styled.button`
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
`

const MenuToggle = styled(NavButton)`
  @media (min-width: 640px) {
    display: none;
  }
`

const MenuWrapper = styled.div<{ isMenuOpen: boolean }>`
  overflow: hidden;
  max-height: ${(p) => (p.isMenuOpen ? `var(${cssVar.menuHeight})` : 0)};
  opacity: ${(p) => (p.isMenuOpen ? 1 : 0)};
  transform: ${(p) => (p.isMenuOpen ? null : 'translateY(-8px) scale(0.8)')};

  transition-property: max-height, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);
  transition-duration: 0.2s, 0.2s, 0.15s;

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

import clsx from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

type NavGroupContextValue = {
  highlightWidth: number
  highlightOffsetLeft: number
  isMouseComingFromOutside: boolean
  setHighlightWidth: (value: number) => void
  setHighlightOffsetLeft: (value: number) => void
  setIsMouseComingFromOutside: (value: boolean) => void
}

const NavGroupContext = React.createContext<NavGroupContextValue | null>(null)

function useNavGroup(): NavGroupContextValue {
  const value = React.useContext(NavGroupContext)

  if (!value) {
    throw new Error('NavGroupLink must be used within a NavGroup')
  }

  return value
}

function NavGroup(props: React.PropsWithChildren<{}>) {
  const [highlightWidth, setHighlightWidth] = React.useState(0)
  const [highlightOffsetLeft, setHighlightOffsetLeft] = React.useState(0)
  const [isMouseComingFromOutside, setIsMouseComingFromOutside] =
    React.useState(true)

  const value = React.useMemo<NavGroupContextValue>(
    () => ({
      highlightWidth,
      highlightOffsetLeft,
      isMouseComingFromOutside: isMouseComingFromOutside,
      setHighlightWidth,
      setHighlightOffsetLeft,
      setIsMouseComingFromOutside: setIsMouseComingFromOutside,
    }),
    [highlightOffsetLeft, highlightWidth, isMouseComingFromOutside]
  )

  return (
    <Wrapper onMouseLeave={() => setIsMouseComingFromOutside(true)}>
      <NavGroupContext.Provider value={value}>
        <HighlightPosition
          style={{
            transform: `translateX(${highlightOffsetLeft}px)`,
            transitionProperty: isMouseComingFromOutside ? 'none' : 'transform',
          }}
        >
          <Highlight
            style={{
              width: highlightWidth,
              transitionProperty: isMouseComingFromOutside
                ? 'opacity, transform'
                : 'opacity, transform, width',
            }}
          />
        </HighlightPosition>
        {props.children}
      </NavGroupContext.Provider>
    </Wrapper>
  )
}

function NavGroupLink(
  props: React.PropsWithChildren<{
    to: string
    /** When true, the active style will only be applied if the location is matched _exactly_. */
    exact?: boolean
  }>
) {
  const navGroup = useNavGroup()
  const router = useRouter()

  function handleMouseLeave() {
    navGroup.setIsMouseComingFromOutside(false)
  }

  const updateHighlight = React.useCallback(
    (element: HTMLElement) => {
      const targetRect = element.getBoundingClientRect()
      const offsetParentRect = element.offsetParent?.getBoundingClientRect()
      const offsetLeft = targetRect.left - (offsetParentRect?.left ?? 0)

      navGroup.setHighlightWidth(targetRect.width)
      navGroup.setHighlightOffsetLeft(offsetLeft)
    },
    [navGroup]
  )

  return (
    <NextLink href={props.to} passHref>
      <Link
        className={clsx({
          active: props.exact
            ? router.pathname === props.to
            : router.pathname.startsWith(props.to),
        })}
        onMouseMove={(event) => updateHighlight(event.currentTarget)}
        onFocus={(event) => updateHighlight(event.currentTarget)}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </Link>
    </NextLink>
  )
}

const Wrapper = styled.div`
  display: none;
  position: relative;

  @media (min-width: 640px) {
    display: flex;
  }
`

const highlightHoverStyles = css`
  opacity: 1;
`

const HighlightPosition = styled.div`
  position: absolute;
  height: 100%;
  z-index: -1;

  /* Handled with inline styles: */
  /* transition-property: none | transform */
  transition-duration: 0.1s;
  transition-timing-function: ease;
`

const Highlight = styled.div`
  height: 100%;
  opacity: 0;
  border-radius: 12px;
  background-color: var(--color-bg-subtle);

  /* Handled with inline styles: */
  /* transition-property: opacity, transform | opacity, transform, width */
  transition-duration: 0.15s, 0.15s, 0.1s;
  transition-timing-function: ease;

  @media (hover: hover) {
    ${Wrapper}:hover & {
      ${highlightHoverStyles}
    }
  }

  ${Wrapper}:focus-within &,
  ${Wrapper}:active & {
    ${highlightHoverStyles}
  }

  ${Wrapper}:active & {
    transform: scale(0.95);
  }
`

const Link = styled.a`
  height: 44px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  padding-left: 16px;
  padding-right: 16px;
  color: var(--color-fg-default);

  transition-property: transform, color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:active {
    transform: scale(0.95);
  }

  &.active {
    color: var(--color-fg-accent);
  }

  --focus-inset: -2px;
  --focus-radius: 14px;

  ${focusRing}
`

export { NavGroup, NavGroupLink }

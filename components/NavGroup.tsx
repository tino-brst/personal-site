import * as React from 'react'
import styled from 'styled-components'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

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

function NavGroup(props: { children?: React.ReactNode }) {
  const [highlightWidth, setHighlightWidth] = React.useState(0)
  const [highlightOffsetLeft, setHighlightOffsetLeft] = React.useState(0)
  const [isMouseComingFromOutside, setIsMouseComingFromOutside] =
    React.useState(true)

  return (
    <Wrapper onMouseLeave={() => setIsMouseComingFromOutside(true)}>
      <NavGroupContext.Provider
        value={{
          highlightWidth,
          highlightOffsetLeft,
          isMouseComingFromOutside: isMouseComingFromOutside,
          setHighlightWidth,
          setHighlightOffsetLeft,
          setIsMouseComingFromOutside: setIsMouseComingFromOutside,
        }}
      >
        <Highlight
          style={{
            width: highlightWidth,
            left: highlightOffsetLeft,
            transitionProperty: isMouseComingFromOutside
              ? 'opacity, transform'
              : 'opacity, transform, left, width',
          }}
        />
        {props.children}
      </NavGroupContext.Provider>
    </Wrapper>
  )
}

function NavGroupLink(props: {
  to: string
  /** When true, the active style will only be applied if the location is matched _exactly_. */
  exact?: boolean
  children?: React.ReactNode
}) {
  const navGroup = useNavGroup()
  const router = useRouter()

  function handleMouseLeave() {
    navGroup.setIsMouseComingFromOutside(false)
  }

  function handleMouseEnter(event: React.MouseEvent<HTMLAnchorElement>) {
    navGroup.setHighlightWidth(event.currentTarget.clientWidth)
    navGroup.setHighlightOffsetLeft(event.currentTarget.offsetLeft)
  }

  return (
    <NextLink href={props.to} passHref={true}>
      <Link
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        isActive={
          props.exact
            ? router.pathname === props.to
            : router.pathname.startsWith(props.to)
        }
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

const Highlight = styled.div`
  position: absolute;
  height: 100%;
  z-index: -1;
  opacity: 0;
  border-radius: 12px;
  background-color: hsla(0 0% 0% / 0.03);

  /* transition-property: opacity, transform OR opacity, transform, left, width */
  transition-duration: 0.15s, 0.15s, 0.1s, 0.1s;
  transition-timing-function: ease-in-out;

  ${Wrapper}:hover &,
  ${Wrapper}:active & {
    opacity: 1;
  }

  ${Wrapper}:active & {
    transform: scale(0.95);
  }
`

const Link = styled.a<{ isActive: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  padding-left: 16px;
  padding-right: 16px;
  color: ${(p) => (p.isActive ? 'black' : 'hsla(0 0% 0% / 0.4)')};

  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:active {
    transform: scale(0.95);
  }
`

export { NavGroup, NavGroupLink }

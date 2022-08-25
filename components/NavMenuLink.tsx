import clsx from 'clsx'
import NextLink from 'next/link'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

type Props = React.PropsWithChildren<{
  href: string
  currentPath: string
  onClick?: () => void
  exact?: boolean
}>

function NavMenuLink(props: Props) {
  return (
    <NextLink href={props.href} passHref>
      <Link
        onClick={props.onClick}
        className={clsx({
          active: props.exact
            ? props.currentPath === props.href
            : props.currentPath.startsWith(props.href),
        })}
      >
        {props.children}
      </Link>
    </NextLink>
  )
}

const linkHoverStyles = css`
  background-color: var(--color-bg-subtle);
`

const Link = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  border-radius: 12px;
  padding: 12px 18px;
  color: var(--color-fg-default);

  transition-property: background-color, transform, color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  @media (hover: hover) {
    &:hover {
      ${linkHoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${linkHoverStyles}
  }

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

export { NavMenuLink }

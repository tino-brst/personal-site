import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

const navButtonHoverStyles = css`
  background-color: var(--color-bg-subtle);
`

const NavButton = styled.button`
  cursor: pointer;
  width: 44px;
  height: 44px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--color-fg-accent);
  user-select: none;

  transition-property: background-color, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  @media (hover: hover) {
    &:hover {
      ${navButtonHoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${navButtonHoverStyles}
  }

  &:active {
    transform: scale(0.94);
  }

  --focus-inset: -2px;
  --focus-radius: 14px;

  ${focusRing}
`

export { NavButton }

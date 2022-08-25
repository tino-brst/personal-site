import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

const hoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const Link = styled.a`
  height: 44px;
  position: relative;
  padding: 12px 14px;
  font-weight: 500;
  font-size: 16px;
  border-radius: 16px;
  color: var(--color-fg-accent);
  background-color: var(--color-bg-subtle);

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  @media (hover: hover) {
    &:hover {
      ${hoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${hoverStyles}
  }

  &:active {
    transform: scale(0.96);
  }

  --focus-inset: -2px;
  --focus-radius: 18px;

  ${focusRing}
`

export { Link }

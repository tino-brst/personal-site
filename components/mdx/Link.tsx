import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

const hoverStyles = css`
  color: var(--color-link-hover);
  text-decoration-color: var(--color-link-decoration-hover);
`

const Link = styled.a`
  position: relative;
  color: var(--color-fg-accent-muted);
  font-weight: 500;
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 1px;
  text-decoration-color: var(--color-link-decoration);

  transition-property: text-decoration-color, color;
  transition-duration: 0.15s;

  @media (hover: hover) {
    &:hover {
      ${hoverStyles}
    }
  }

  &:focus-visible {
    ${hoverStyles}
  }

  --focus-inset: -2px;
  --focus-radius: 4px;

  ${focusRing}
`

export { Link }

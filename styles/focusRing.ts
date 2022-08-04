import { css } from 'styled-components'

// TODO switch to just changing the opacity instead of the shadow color (allows
// to animate both separately too)

const focusRingBaseStyles = css`
  content: '';
  pointer-events: none;
  position: absolute;
  box-shadow: 0 0 0 1px transparent;
  inset: var(--focus-inset, 0);
  border-radius: var(--focus-radius, 0);

  transition-property: box-shadow;
  transition-duration: 0.2s;
`

const focusRingVisibleStyles = css`
  box-shadow: 0 0 0 2px var(--color-focus-ring);
`

const focusRingVisibleHoverStyles = css`
  box-shadow: 0 0 0 2px var(--color-focus-ring-hover);
`

const focusRing = css`
  &::before {
    ${focusRingBaseStyles}
  }

  &:focus-visible::before {
    ${focusRingVisibleStyles}
  }

  @media (hover: hover) {
    &:focus-visible:hover::before {
      ${focusRingVisibleHoverStyles}
    }
  }
`

export {
  focusRing,
  focusRingBaseStyles,
  focusRingVisibleStyles,
  focusRingVisibleHoverStyles,
}

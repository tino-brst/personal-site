import styled, { css } from 'styled-components'

const hoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const Link = styled.a`
  height: 44px;
  position: relative;
  padding: 12px 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  border-radius: 16px;
  color: var(--color-fg-accent);
  background-color: var(--color-bg-subtle);

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:focus-visible,
  &:active {
    ${hoverStyles}
  }

  @media (hover: hover) {
    &:hover {
      ${hoverStyles}
    }
  }

  &:active {
    transform: scale(0.96);
  }

  &::after {
    content: '';
    position: absolute;
    border-radius: 20px;
    inset: -4px;
    box-shadow: 0 0 0 1px transparent;

    transition-property: box-shadow;
    transition-duration: 0.2s;
  }

  &:focus-visible::after {
    box-shadow: 0 0 0 4px hsla(0 0% 0% / 0.1);
  }
`

export { Link }

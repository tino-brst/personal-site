import styled from 'styled-components'

const Link = styled.a`
  height: 44px;
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

  &:hover,
  &:active {
    background-color: var(--color-bg-subtle-hover);
  }

  &:active {
    transform: scale(0.96);
  }
`

export { Link }

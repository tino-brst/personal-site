import styled from 'styled-components'

const Link = styled.a`
  height: 44px;
  padding: 12px 14px;
  font-weight: 500;
  line-height: 1;
  border-radius: 16px;
  color: black;
  background-color: hsla(0 0% 0% / 0.03);

  transition-property: transform, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &:active {
    transform: scale(0.96);
  }
`

export { Link }

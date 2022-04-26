import styled from 'styled-components'

const Link = styled.a`
  color: hsl(0 0% 20%);
  font-weight: 500;
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 1px;
  text-decoration-color: hsla(0 0% 0% / 0.2);

  &:hover {
    color: hsla(0 0% 0% / 1);
    text-decoration-color: hsla(0 0% 0% / 0.3);
  }
`

export { Link }

import styled from 'styled-components'

const Link = styled.a`
  color: hsla(0 0% 0% / 0.7);
  font-weight: 500;
  box-shadow: 0 1px hsla(0 0% 0% / 0.2);

  &:hover {
    color: hsla(0 0% 0% / 1);
    box-shadow: 0 1px hsla(0 0% 0% / 0.3);
  }
`

export { Link }

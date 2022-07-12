import styled from 'styled-components'

const Link = styled.a`
  color: var(--color-fg-accent-muted);
  font-weight: 500;
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 1px;
  text-decoration-color: var(--color-link-decoration);

  transition-property: text-decoration-color, color;
  transition-duration: 0.15s;

  &:hover {
    color: var(--color-link-hover);
    text-decoration-color: var(--color-link-decoration-hover);
  }
`

export { Link }

import styled from 'styled-components'

const Code = styled.code`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9rem;

  p & {
    color: var(--color-fg-accent-muted);
    background-color: var(--color-bg-muted);
    border-radius: 4px;
    padding: 2px 4px;
  }
`

export { Code }

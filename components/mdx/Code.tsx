import styled from 'styled-components'

const Code = styled.code`
  /* TODO: Use the same font across OSs? */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9rem;

  /* TODO: probably will have to tweak this to keep it working inside asides, etc (everywhere expect code blocks) */

  p & {
    color: var(--color-fg-accent-muted);
    background-color: var(--color-bg-muted);
    border-radius: 4px;
    padding: 2px 4px;
  }
`

export { Code }

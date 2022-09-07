import styled from 'styled-components'

const Paragraph = styled.p`
  color: var(--color-fg-prose);
  line-height: 1.7em;
  margin-top: 20px;
  margin-bottom: 20px;

  main > &:first-of-type {
    min-height: 3.2em;
  }

  main > &:first-of-type::first-letter {
    font-size: 3.2em;
    font-weight: 500;
    float: left;
    line-height: 0.9em;
    margin-right: 8px;
    margin-top: 5px;
    color: var(--color-fg-accent);
  }
`

export { Paragraph }

import styled from 'styled-components'

const Paragraph = styled.p`
  color: var(--color-fg-prose);
  line-height: 1.5em;
  margin-top: 20px;
  margin-bottom: 20px;

  main > &:first-of-type {
    /* Takes into account */
    min-height: 2.9em;
  }

  main > &:first-of-type::first-letter {
    font-size: 2.9em;
    font-weight: 500;
    float: left;
    line-height: 0.9em;
    margin-right: 8px;
    margin-top: 5px;
    color: var(--color-fg-accent);
  }
`

export { Paragraph }

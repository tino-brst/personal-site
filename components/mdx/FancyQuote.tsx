import styled from 'styled-components'

function FancyQuote(props: React.PropsWithChildren<{}>) {
  return <Root className="fancy">{props.children}</Root>
}

const Root = styled.blockquote`
  width: fit-content;
  margin-top: 28px;
  margin-bottom: 28px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  color: var(--color-fg-quote);
  font-variation-settings: 'slnt' -10;
  font-synthesis: none;
  font-size: 1.1em;
  font-weight: 300;
  text-align: center;

  &::before,
  &::after {
    color: var(--color-fg-muted);
    font-size: 1.2em;
    font-weight: 400;
    line-height: 1;
  }

  &::before {
    content: '“';
    margin-right: 0.5ch;
  }

  &::after {
    content: '”';
    margin-left: 0.5ch;
  }

  @media (min-width: 640px) {
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
    margin-top: 32px;
    margin-bottom: 32px;
  }
`

export { FancyQuote }

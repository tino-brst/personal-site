import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

const linkHoverStyles = css`
  color: var(--color-link-hover);
  text-decoration-color: var(--color-link-decoration-hover);
`

const Wrapper = styled.div`
  color: var(--color-fg-prose);
  line-height: 1.7;

  & > *:first-child {
    margin-top: 0;
  }

  strong {
    font-weight: 550;
    color: var(--color-fg-accent-muted);
  }

  p {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  & > p:first-of-type {
    min-height: 3.2em;
  }

  & > p:first-of-type::first-letter {
    font-size: 3.2em;
    font-weight: 500;
    float: left;
    line-height: 0.9;
    margin-right: 8px;
    margin-top: 5px;
    color: var(--color-fg-accent);
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    font-size: 0.9em;
  }

  /* All code that is not part of a codeblock (i.e. <pre><code>...</code></pre>) */
  *:not(pre) > code {
    color: var(--color-fg-accent-muted);
    background-color: var(--color-bg-muted);
    border-radius: 4px;
    padding: 2px 4px;
  }

  /* All links that are not heading links */
  *:not(h2, h3, h4) > a {
    position: relative;
    color: var(--color-fg-accent-muted);
    font-weight: 500;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 1px;
    text-decoration-color: var(--color-link-decoration);

    transition-property: text-decoration-color, color;
    transition-duration: 0.15s;

    @media (hover: hover) {
      &:hover {
        ${linkHoverStyles}
      }
    }

    &:focus-visible {
      ${linkHoverStyles}
    }

    --focus-inset: -2px;
    --focus-radius: 4px;

    ${focusRing}
  }
`

export { Wrapper as Wrapper }

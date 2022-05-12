import { css, keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`

const animation = {
  fadeIn: css`
    animation: ${fadeIn} 0.2s ease-out;
  `,
}

export { animation }

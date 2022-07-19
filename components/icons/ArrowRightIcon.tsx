import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
}

function ArrowRightIcon(props: Props) {
  const maskId = React.useId()

  return (
    <Root
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill="black" strokeWidth="0" />
          <path d="M 3 10 L 17 10 m -6 -6 l 6 6 l -6 6" />
        </mask>
      </defs>
      <rect width="100%" height="100%" mask={`url(#${maskId})`} />
    </Root>
  )
}

const Root = styled.svg`
  fill: currentColor;

  mask {
    fill: none;
    stroke: white;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

export { ArrowRightIcon }

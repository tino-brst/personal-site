import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
}

function ChevronLeftIcon(props: Props) {
  // Makes sure that the mask ids don't collide (i.e. the icon breaks) when
  // having multiple instances of the icon on the same page
  // TODO should do that to every icon 😅
  const maskId = React.useId()

  return (
    <Root
      className={props.className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill="black" strokeWidth="0" />
          <path d="M 5 7 l 3 -3.5 M 5 7 l 3 3.5" />
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

export { ChevronLeftIcon }

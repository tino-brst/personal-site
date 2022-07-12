import clsx from 'clsx'
import styled from 'styled-components'

type Props = {
  isComplete?: boolean
}

function CheckMarkIcon(props: Props) {
  return (
    <Root
      className={clsx({ complete: props.isComplete })}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 4 12 L 9 17 L 17 4" pathLength="1" />
    </Root>
  )
}

const Root = styled.svg`
  color: currentColor;
  fill: none;

  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: currentColor;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;

  transition-property: stroke-dashoffset;
  transition-duration: 0.4s;

  &.complete {
    stroke-dashoffset: 0;
  }
`

export { CheckMarkIcon }

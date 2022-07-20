import styled from 'styled-components'

type Props = {
  className?: string
}

function ChevronLeftIcon(props: Props) {
  return (
    <Root
      className={props.className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 5 7 l 3 -3.5 M 5 7 l 3 3.5" />
    </Root>
  )
}

const Root = styled.svg`
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
`

export { ChevronLeftIcon }

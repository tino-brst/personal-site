import styled from 'styled-components'

type Props = {
  className?: string
}

function ArrowTopRightIcon(props: Props) {
  return (
    <Root
      className={props.className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 3 11 L 11 3 m -6 0 h 6 v 6" />
    </Root>
  )
}

const Root = styled.svg`
  fill: none;
  stroke-width: 1.5px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
`

export { ArrowTopRightIcon }

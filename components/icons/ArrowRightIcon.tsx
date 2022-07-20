import styled from 'styled-components'

type Props = {
  className?: string
}

function ArrowRightIcon(props: Props) {
  return (
    <Root
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 3 10 L 17 10 m -6 -6 l 6 6 l -6 6" />
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

export { ArrowRightIcon }

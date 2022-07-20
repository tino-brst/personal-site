import styled from 'styled-components'

type Props = {
  className?: string
}

function MagnifyingGlassIcon(props: Props) {
  return (
    <Root
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 2 9 A 6 6 0 0 1 14 9 A 6 6 0 0 1 2 9 M 12.5 13.5 L 16.5 17.5" />
    </Root>
  )
}

const Root = styled.svg`
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
`

export { MagnifyingGlassIcon }

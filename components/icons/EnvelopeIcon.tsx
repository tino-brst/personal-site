import styled from 'styled-components'

type Props = {
  className?: string
}

function EnvelopeIcon(props: Props) {
  return (
    <Root
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.5 14.5V5.5C1.5 4.39543 2.39543 3.5 3.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V14.5C18.5 15.6046 17.6046 16.5 16.5 16.5H3.5C2.39543 16.5 1.5 15.6046 1.5 14.5Z" />
      <path d="M2.5 4.5L8.54092 10.9437C9.33107 11.7865 10.6689 11.7865 11.4591 10.9437L17.5 4.5" />
    </Root>
  )
}

const Root = styled.svg`
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
`

export { EnvelopeIcon }

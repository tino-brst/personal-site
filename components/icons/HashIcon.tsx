import styled from 'styled-components'

function HashIcon({ className }: { className?: string }) {
  return (
    <Root
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 3.5 13 H 15.5 M 4.5 7 H 16.5 M 6 17.5 L 8.5 2.5 M 11.5 17.5 L 14 2.5" />
    </Root>
  )
}

const Root = styled.svg`
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2;
`
export { HashIcon }

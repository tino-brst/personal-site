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
      <defs>
        <mask id="hash-icon-mask">
          <path d="M3.5 13H15.5" />
          <path d="M4.5 7H16.5" />
          <path d="M6 17.5L8.5 2.5" />
          <path d="M11.5 17.5L14 2.5" />
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#hash-icon-mask)" />
    </Root>
  )
}

const Root = styled.svg`
  fill: currentColor;

  mask {
    stroke-linecap: round;
    stroke-width: 2;
    stroke: white;
  }
`
export { HashIcon }

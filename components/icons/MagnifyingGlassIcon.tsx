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
      <defs>
        <mask id="magnifying-glass-mask">
          <rect width="100%" height="100%" fill="black" strokeWidth="0" />
          <circle cx="8" cy="9" r="6" />
          <path d="M 12.5 13.5 L 16.5 17.5" />
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#magnifying-glass-mask)" />
    </Root>
  )
}

const Root = styled.svg`
  fill: currentColor;

  mask {
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke: white;
  }
`

export { MagnifyingGlassIcon }

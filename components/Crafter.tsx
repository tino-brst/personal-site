import styled from 'styled-components'

function Crafter() {
  return (
    <Root
      height="1em"
      viewBox="0 0 35.353 8.044"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)">
        <path d="M-36.989 66.725v.357M6.188 3.1C5.094 2.543 3.01 6.208 6.34 6.23c.268.002.572-.095.698-.343M8.102 2.997c-.007.954.209 1.886.502 2.787M8.385 3.927c-.141.278.541-1.04 1.225-1.035M28.507 2.064c.009-1.252 2.01-.797 2.171.213.268 1.678-1.03.965-1.457 1.175-.12.058.06.747.06.856M29.6 5.693l-.197-.001.132-.065.131.067h0M2.624 6.964C1.332 5.654 1.43 3.557 2.2 2.047M33.036 5.478c.788-1.548.333-2.912-.362-4.327M10.776 2.9c1.789-.879 2.059 1.203 2.05 2.51" />
        <path d="M12.55 4.125c-.102.2-1.526-.493-1.715.415-.245 1.183.978 1.439 1.847 1.012M15.492 1.436c-.285-.58-1.136.315-1.217.705-.117.564.314 3.753.688 3.57" />
        <path d="M14.766 3.25c-.071.009-.286.04-.214.033.191-.017.383-.03.571-.067l.357-.069c-.235.05-.475.071-.714.102zM17.204 1.448c.002-.384.063 1.104.06 1.427-.005.852.18 1.815.338 2.64.129.668 1.681.084 1.569.083" />
        <path d="M17.05 2.945c.447.003 1.633-.163 1.57-.132M20.535 4.182c.369.002.701-.138 1.071-.135 2.957.021-.53-2.673-.995-.435-.12.579.089 1.755.77 1.93.513.133 1.46-.203 1.357-.204M24.329 2.212c-.008 1.056.413 2.032.406 3.07" />
        <path d="M24.463 3.354c.246-.72.67-1.047 1.364-1.274" />
      </g>
    </Root>
  )
}

const Root = styled.svg`
  fill: none;
  stroke: var(--color-fg-prose);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 0.65;
  margin-left: 0.5ch;
  margin-right: 0.3ch;
  transform: translateY(3px) rotate(2deg) scale(1.15);
`

export { Crafter }

import styled from 'styled-components'

function CalendarIcon() {
  return (
    <Root
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="calendar-icon-mask">
          <rect x="1" y="1" width="12" height="12" rx="2" />
          <rect x="2" y="4" width="10" height="8" rx="1" fill="black" />
          <rect x="5.5" y="7.5" width="1" height="1" rx="0.25" />
          <rect x="5.5" y="5.5" width="1" height="1" rx="0.25" />
          <rect x="5.5" y="9.5" width="1" height="1" rx="0.25" />
          <rect x="7.5" y="7.5" width="1" height="1" rx="0.25" />
          <rect x="7.5" y="5.5" width="1" height="1" rx="0.25" />
          <rect x="7.5" y="9.5" width="1" height="1" rx="0.25" />
          <rect x="9.5" y="7.5" width="1" height="1" rx="0.25" />
          <rect x="9.5" y="5.5" width="1" height="1" rx="0.25" />
          <rect x="3.5" y="7.5" width="1" height="1" rx="0.25" />
          <rect x="3.5" y="9.5" width="1" height="1" rx="0.25" />
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#calendar-icon-mask)" />
    </Root>
  )
}

const Root = styled.svg`
  fill: currentColor;

  mask {
    fill: white;
  }
`

export { CalendarIcon }

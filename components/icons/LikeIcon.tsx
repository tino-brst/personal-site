import styled from 'styled-components'

function LikeIcon({ className }: { className?: string }) {
  return (
    <Root
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M26 13.7706C26 20.2285 17.6667 26 16 26C14.3333 26 6 20.2285 6 13.7706C6 10.5887 8.61667 8 11.8333 8C14.3333 8 15.5575 9.71327 16 10.5511C16.4425 9.71327 17.6667 8 20.1667 8C23.3833 8 26 10.5887 26 13.7706Z" />
    </Root>
  )
}

const Root = styled.svg`
  fill: currentColor;
`

export { LikeIcon }

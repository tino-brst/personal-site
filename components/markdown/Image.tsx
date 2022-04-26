import * as React from 'react'
import styled from 'styled-components'
import NextImage from 'next/image'

type Props = {
  src: string
  width: number
  height: number
}

function Image(props: Props) {
  return (
    <Wrapper>
      <StyledImage layout="responsive" {...props} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --border-radius: 16px;
  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  box-shadow: inset 0 -0.5px 0 hsla(0 0% 0% / 0.1),
    inset 0 0.5px 0 hsla(0 0% 0% / 0.1);

  @media (min-width: 640px) {
    box-shadow: inset 0 0 0 0.5px hsla(0 0% 0% / 0.1);
    border-radius: 16px;
    overflow: hidden;
  }
`

const StyledImage = styled(NextImage)`
  z-index: -1;
`

export { Image }

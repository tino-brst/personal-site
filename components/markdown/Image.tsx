import NextImage from 'next/image'
import * as React from 'react'
import styled from 'styled-components'

type Props = {
  src?: string
  width?: string | number
  height?: string | number
}

function Image(props: Props) {
  return (
    <Wrapper>
      {props.src && (
        <StyledImage
          layout="responsive"
          src={props.src}
          width={props.width}
          height={props.height}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --border-radius: 10px;
  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  box-shadow: inset 0 -1px 0 hsla(0 0% 0% / 0.05),
    inset 0 1px 0 hsla(0 0% 0% / 0.1);

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
    box-shadow: inset 0 0 0 1px hsla(0 0% 0% / 0.05);
    border-radius: var(--border-radius);
    overflow: hidden;
  }
`

const StyledImage = styled(NextImage)`
  z-index: -1;
`

export { Image }

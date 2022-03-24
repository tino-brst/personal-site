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
      <NextImage layout="responsive" {...props} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --border-radius: 10px;
  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 32px;
  margin-bottom: 28px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 -0.5px 0 hsla(0 0% 0% / 0.1),
      inset 0 0.5px 0 hsla(0 0% 0% / 0.1);
  }

  @media (min-width: 768px) {
    border-radius: var(--border-radius);
    overflow: hidden;

    &::after {
      border-radius: var(--border-radius);
      box-shadow: inset 0 0 0 0.5px hsla(0 0% 0% / 0.1);
    }
  }
`

export { Image }

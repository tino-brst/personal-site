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
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: -24px;
  margin-right: -24px;
`

export { Image }

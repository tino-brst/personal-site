import * as React from 'react'
import NextImage from 'next/image'

type Props = {
  src: string
  width: number
  height: number
}

function Image(props: Props) {
  return (
    <div className="image-wrapper">
      <NextImage className="image" layout="responsive" {...props} />
    </div>
  )
}

export { Image }

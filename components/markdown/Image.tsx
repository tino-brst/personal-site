import * as React from 'react'
import NextImage from 'next/image'

type Props = React.ComponentProps<typeof NextImage>

function Image(props: Props) {
  return (
    <div className="image-wrapper">
      <NextImage className="image" layout="responsive" {...props} />
    </div>
  )
}

export { Image }

import * as React from 'react'
import NextImage from 'next/image'

type Props = React.ComponentProps<typeof NextImage>

function Image(props: Props) {
  return <NextImage className="image" layout="responsive" {...props} />
}

export { Image }

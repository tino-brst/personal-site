import * as React from 'react'
import NextImage from 'next/image'

// TODO: make type more specific (no need to get the layout if it will always be 'responsive')
type Props = React.ComponentProps<typeof NextImage>

function Image(props: Props) {
  return (
    <div className="image-wrapper">
      <NextImage className="image" layout="responsive" {...props} />
    </div>
  )
}

export { Image }

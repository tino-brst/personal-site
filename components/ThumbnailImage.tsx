import * as React from 'react'
import NextImage from 'next/image'

// TODO: make type more specific (no need to get the layout if it will always be 'fill')
type Props = React.ComponentProps<typeof NextImage>

function ThumbnailImage(props: Props) {
  return (
    <div className="thumbnail-image-wrapper">
      <NextImage className="thumbnail-image" layout="fill" {...props} />
    </div>
  )
}

export { ThumbnailImage }

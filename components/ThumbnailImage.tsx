import * as React from 'react'
import NextImage from 'next/image'

type Props = {
  src: string
}

function ThumbnailImage(props: Props) {
  return (
    <div className="thumbnail-image-wrapper">
      <NextImage className="thumbnail-image" layout="fill" {...props} />
    </div>
  )
}

export { ThumbnailImage }

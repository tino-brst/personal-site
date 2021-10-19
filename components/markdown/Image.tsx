import * as React from 'react'
import NextImage from 'next/image'

type Props = {
  alt: string
  src: string
}

// TODO: make the aspect ratio configurable (not all images are going to have
// the same shape). Maybe there is a remark plugin that exposes their size? And
// that can be used as default

function Image(props: Props) {
  return (
    <div className="image-wrapper">
      <NextImage
        className="image"
        src={props.src}
        alt={props.alt}
        objectFit="cover"
        layout="fill"
      />
    </div>
  )
}

export { Image }

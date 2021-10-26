import * as React from 'react'
import NextImage from 'next/image'

type Props = {
  src: string
}

function HeaderImage(props: Props) {
  return (
    <div className="header-image-wrapper">
      <NextImage className="header-image" layout="fill" {...props} />
    </div>
  )
}

export { HeaderImage }

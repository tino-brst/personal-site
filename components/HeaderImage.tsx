import * as React from 'react'
import NextImage from 'next/image'

// TODO: make type more specific (no need to get the layout if it will always be 'fill')
type Props = React.ComponentProps<typeof NextImage>

function HeaderImage(props: Props) {
  return (
    <div className="header-image-wrapper">
      <NextImage className="header-image" layout="fill" {...props} />
    </div>
  )
}

export { HeaderImage }

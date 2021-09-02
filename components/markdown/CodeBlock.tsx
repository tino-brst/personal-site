import * as React from 'react'

type Props = {
  children?: React.ReactNode
}

function CodeBlock(props: Props) {
  return <pre {...props} />
}

export { CodeBlock }

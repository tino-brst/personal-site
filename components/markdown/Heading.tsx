import * as React from 'react'

type Props = {
  level: 1 | 2 | 3 | 4 | 5 | 6
  id: string
  children: React.ReactNode
}

const Heading = React.forwardRef<HTMLHeadingElement, Props>((props, ref) => {
  // 'as const' makes `h${props.level}` of type 'h1' | 'h2' | 'h3' | ... instead
  // of just string
  const Component = `h${props.level}` as const

  return (
    <Component ref={ref} id={props.id}>
      {props.children}
    </Component>
  )
})

Heading.displayName = 'Heading'

export { Heading }

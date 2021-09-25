import { useTableOfContents } from 'contexts/table-of-contents'
import * as React from 'react'

type Props = {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children?: React.ReactNode
}

function Heading(props: Props) {
  // 'as const'? Component: string -> Component: 'h1' | 'h2' | 'h3' | ...
  const Component = `h${props.level}` as const
  const headingElementRef = React.useRef<HTMLHeadingElement>(null)
  const tableOfContents = useTableOfContents()

  React.useEffect(() => {
    if (!headingElementRef.current) return

    const headingElement = headingElementRef.current
    tableOfContents.registerSectionHeading(headingElement)

    return () => tableOfContents.unregisterSectionHeading(headingElement)
  }, [tableOfContents])

  return <Component ref={headingElementRef} {...omit(props, 'level')} />
}

/**
 * Returns the object passed without the specified properties.
 */
function omit<T extends Record<string, any>, K extends Array<keyof T>>(
  object: T,
  ...keys: K
): Omit<T, K[number]> {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key))
  ) as Omit<T, K[number]> // not a fan, but those Object methods are not helping
}

export { Heading }

import * as React from 'react'
import { Heading } from './markdown/Heading'
import { useTableOfContents } from 'contexts/table-of-contents'

/**
 * Composes the `Heading` component, and just adds the smarts to interact with a
 * table of contents.
 */
function TableOfContentsHeading(
  props: React.ComponentPropsWithRef<typeof Heading>
) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const tableOfContents = useTableOfContents()

  React.useEffect(() => {
    if (!headingRef.current) return

    const heading = headingRef.current
    tableOfContents.registerSectionHeading(heading)

    return () => tableOfContents.unregisterSectionHeading(heading)
  }, [tableOfContents])

  return (
    <Heading ref={headingRef} id={props.id} level={props.level}>
      {props.children}
    </Heading>
  )
}

export { TableOfContentsHeading }

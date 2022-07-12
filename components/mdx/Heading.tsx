import { Link2Icon } from '@radix-ui/react-icons'
import { useTableOfContents } from 'contexts/table-of-contents'
import * as React from 'react'
import styled, { css, StyledComponent } from 'styled-components'

type Props = {
  level: 2 | 3 | 4
  id?: string
  children?: React.ReactNode
}

function Heading(props: Props) {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const tableOfContents = useTableOfContents()

  React.useEffect(() => {
    if (!ref.current) return

    const heading = ref.current
    tableOfContents.registerSectionHeading(heading)

    return () => tableOfContents.unregisterSectionHeading(heading)
  }, [tableOfContents])

  let Component: StyledComponent<'h2' | 'h3' | 'h4', any, {}, never>

  switch (props.level) {
    case 2:
      Component = H2
      break
    case 3:
      Component = H3
      break
    case 4:
      Component = H4
      break
  }

  return (
    <Component ref={ref} id={props.id}>
      <a href={`#${props.id}`}>
        {props.children}
        <Icon width={18} height={18} />
      </a>
    </Component>
  )
}

function Heading2(props: Omit<Props, 'level'>) {
  return <Heading {...props} level={2} />
}

function Heading3(props: Omit<Props, 'level'>) {
  return <Heading {...props} level={3} />
}

function Heading4(props: Omit<Props, 'level'>) {
  return <Heading {...props} level={4} />
}

const Icon = styled(Link2Icon)`
  margin-left: 0.5ch;
  color: var(--color-fg-default);
  will-change: transform;
`

const sharedStyles = css`
  color: var(--color-fg-accent);
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: var(--margin-top);
  scroll-margin-top: var(--margin-top);

  @media (hover: hover) {
    & ${Icon} {
      opacity: 0;
      transform: scale(0.8);

      transition-property: opacity, transform;
      transition-duration: 0.1s;
      transition-timing-function: ease-in-out;
    }

    &:hover ${Icon} {
      opacity: 1;
      transform: none;
    }
  }
`

const H2 = styled.h2`
  ${sharedStyles}

  --margin-top: 40px;

  font-size: 1.8rem;
`

const H3 = styled.h3`
  ${sharedStyles}

  --margin-top: 32px;

  font-size: 1.4rem;
`

const H4 = styled.h4`
  ${sharedStyles}

  --margin-top: 28px;

  font-size: 1.2rem;
`

export { Heading2, Heading3, Heading4 }

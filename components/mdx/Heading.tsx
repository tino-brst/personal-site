import { LinkIcon } from '@components/icons/LinkIcon'
import { useTableOfContents } from 'contexts/table-of-contents'
import * as React from 'react'
import styled, { css, StyledComponent } from 'styled-components'
import { focusRing } from 'styles/focusRing'

type Props = React.PropsWithChildren<{
  level: 2 | 3 | 4
  id?: string
}>

function Heading(props: Props) {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const { registerSectionHeading, unregisterSectionHeading } =
    useTableOfContents()

  React.useEffect(() => {
    if (!ref.current) return

    const heading = ref.current
    registerSectionHeading(heading)

    return () => unregisterSectionHeading(heading)
  }, [registerSectionHeading, unregisterSectionHeading])

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
      <Link href={`#${props.id}`}>
        {props.children}
        <Icon />
      </Link>
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

const Link = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;

  transition-property: transform;
  transition-duration: 0.15s;

  &:active {
    transform: scale(0.98);
  }

  --focus-inset: -4px -4px;
  --focus-radius: 8px;

  ${focusRing}
`

const Icon = styled(LinkIcon)`
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

    ${Link}:focus-visible ${Icon}, &:hover ${Icon} {
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

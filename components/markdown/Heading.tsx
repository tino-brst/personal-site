import * as React from 'react'
import styled, { css, StyledComponent } from 'styled-components'
import { useRegisterSectionHeading } from 'contexts/table-of-contents'
import { Link2Icon } from '@radix-ui/react-icons'

type Props = {
  level: 2 | 3 | 4
  id: string
  children: React.ReactNode
}

function Heading(props: Props) {
  const ref = useRegisterSectionHeading()

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
  color: hsla(0 0% 0% / 0.5);
`

const sharedStyles = css`
  margin-bottom: 20px;
  font-weight: 600;

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
  font-size: 1.8rem;
  margin-top: 40px;
`

const H3 = styled.h3`
  ${sharedStyles}
  font-size: 1.4rem;
  margin-top: 32px;
`

const H4 = styled.h4`
  ${sharedStyles}
  font-size: 1.2rem;
  margin-top: 28px;
`

export { Heading2, Heading3, Heading4 }

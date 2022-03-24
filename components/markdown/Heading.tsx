import * as React from 'react'
import styled, { css } from 'styled-components'
import { useRegisterSectionHeading } from 'contexts/table-of-contents'
import { Link2Icon } from '@radix-ui/react-icons'

type Props = {
  level: 2 | 3
  id: string
  children: React.ReactNode
}

function Heading(props: Props) {
  const ref = useRegisterSectionHeading()
  const Component = props.level === 2 ? H2 : H3

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

export { Heading2, Heading3 }

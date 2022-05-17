import * as React from 'react'
import styled from 'styled-components'
import { CopyIcon } from '@radix-ui/react-icons'

type Props = {
  children?: React.ReactNode
}

function CodeBlock(props: Props) {
  const preElementRef = React.useRef<HTMLPreElement>(null)

  const handleClick = () => {
    const preTextContent = preElementRef.current?.textContent ?? ''
    navigator.clipboard?.writeText(preTextContent)
  }

  return (
    <Wrapper>
      <Pre {...props} ref={preElementRef}>
        {props.children}
      </Pre>
      <CopyButton onClick={handleClick}>
        <Icon />
      </CopyButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 20px;
  margin-bottom: 20px;
`

const Pre = styled.pre`
  line-height: 1.4;
  background-color: hsla(0 0% 0% / 0.03);
  padding-top: 20px;
  padding-bottom: 20px;
  white-space: pre;

  & .line {
    padding-left: 24px;
    padding-right: 24px;
  }

  & .line.highlight {
    background-color: hsla(0 0% 0% / 0.04);
  }

  @media (min-width: 640px) {
    border-radius: 16px;
  }
`

const CopyButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px;
  cursor: pointer;
  background-color: hsla(0 0% 100%);
  border-radius: 8px;
  box-shadow: 0 0 0 1px hsla(0 0% 0% / 0.05);

  &:hover {
    background-color: hsla(0 0% 98%);
  }

  transition-property: background-color, opacity, transform;
  transition-duration: 0.15s;

  @media (hover: hover) {
    opacity: 0;
    transform: scale(0.95);

    ${Wrapper}:hover &, 
    &:focus-visible {
      opacity: 1;
      transform: none;
    }
  }
`

const Icon = styled(CopyIcon)`
  display: block;
  width: 20px;
  height: 20px;
  color: black;
  will-change: transform;

  transition-property: transform;
  transition-duration: 0.15s;

  ${CopyButton}:active & {
    transform: scale(0.9);
  }
`

export { CodeBlock }

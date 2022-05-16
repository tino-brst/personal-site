import * as React from 'react'
import styled from 'styled-components'

type Props = {
  children?: React.ReactNode
}

function CodeBlock(props: Props) {
  const preElementRef = React.useRef<HTMLPreElement>(null)

  const handleClick = () => {
    const preTextContent = preElementRef.current?.textContent ?? ''
    navigator.clipboard.writeText(preTextContent)
  }

  return (
    <Pre {...props} ref={preElementRef}>
      {props.children}
      {/* <CopyButton onClick={handleClick}>Copy</CopyButton> */}
    </Pre>
  )
}

const Pre = styled.pre`
  position: relative;
  line-height: 1.4;
  background-color: hsla(0 0% 0% / 0.03);
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 20px;
  margin-bottom: 20px;
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

const CopyButton = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`

export { CodeBlock }

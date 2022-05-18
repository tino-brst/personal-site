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
  --margin-x: 24px;
  --copy-button-size: 36px;
  --copy-button-inset: 16px;

  position: relative;
  margin-left: calc(-1 * var(--margin-x));
  margin-right: calc(-1 * var(--margin-x));
  margin-top: 20px;
  margin-bottom: 20px;
  overflow: hidden;

  @media (min-width: 640px) {
    border-radius: 16px;
  }
`

const Pre = styled.pre`
  line-height: 1.4;
  background-color: hsla(0 0% 0% / 0.03);
  padding-top: 20px;
  padding-bottom: 20px;
  white-space: pre;
  overflow-x: auto;

  & code {
    display: block;
    min-width: fit-content;
  }

  & .line {
    padding-left: var(--margin-x);
    padding-right: calc(2 * var(--copy-button-inset) + var(--copy-button-size));
  }

  & .line.highlight {
    background-color: hsla(0 0% 0% / 0.04);
    box-shadow: inset 2px 0 hsla(0 0% 0% / 0.05);
  }
`

const CopyButton = styled.button`
  position: absolute;
  top: var(--copy-button-inset);
  right: var(--copy-button-inset);
  width: var(--copy-button-size);
  height: var(--copy-button-size);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: hsla(0 0% 98%);
  border-radius: 8px;
  box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 6%),
    0 2px 11px 3px hsl(0deg 0% 0% / 2%);

  &:hover {
    background-color: hsla(0 0% 96%);
  }

  transition-property: background-color, opacity, transform;
  transition-duration: 0.15s;

  @media (hover: hover) {
    opacity: 0;
    transform: scale(0.9);

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

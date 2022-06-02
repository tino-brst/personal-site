import { CopyIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import styled from 'styled-components'

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
  --copy-button-size: 32px;
  --copy-button-inset-x: 24px;
  --copy-button-inset-y: 20px;

  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  overflow: hidden;

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 12px;
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
    padding-left: 24px;
    padding-right: calc(
      2 * var(--copy-button-inset-x) + var(--copy-button-size)
    );
  }

  & .line.highlight {
    background-color: hsla(0 0% 0% / 0.04);
  }
`

const CopyButton = styled.button`
  position: absolute;
  bottom: var(--copy-button-inset-y);
  right: var(--copy-button-inset-x);
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
  --size: 18px;

  display: block;
  width: var(--size);
  height: var(--size);
  color: black;
  will-change: transform;

  transition-property: transform;
  transition-duration: 0.15s;

  ${CopyButton}:active & {
    transform: scale(0.9);
  }
`

export { CodeBlock }

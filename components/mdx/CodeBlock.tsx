import { CheckMarkIcon } from '@components/icons/CheckMarkIcon'
import { CopyIcon } from '@components/icons/CopyIcon'
import { useTimeout } from '@hooks/useTimeout'
import clsx from 'clsx'
import * as React from 'react'
import styled from 'styled-components'

type Props = {
  children?: React.ReactNode
}

function CodeBlock(props: Props) {
  const preElementRef = React.useRef<HTMLPreElement>(null)

  const [hasJustCopied, setHasJustCopied] = React.useState(false)
  const hasJustCopiedTimeout = useTimeout(() => setHasJustCopied(false), 1500)

  function handleCopyButtonClick() {
    navigator.clipboard?.writeText(preElementRef.current?.textContent ?? '')

    setHasJustCopied(true)
    hasJustCopiedTimeout.start()
  }

  return (
    <Wrapper>
      <Pre {...props} ref={preElementRef}>
        {props.children}
      </Pre>
      <CopyButton
        className={clsx({ copied: hasJustCopied })}
        onClick={handleCopyButtonClick}
      >
        <CopyIconWrapper>
          <CopyIcon />
        </CopyIconWrapper>
        <CheckMarkIconWrapper>
          <CheckMarkIcon isComplete={hasJustCopied} />
        </CheckMarkIconWrapper>
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
  box-shadow: inset 0 -0.5px 0 var(--color-border-code),
    inset 0 0.5px 0 var(--color-border-code);

  @media (min-width: 640px) {
    --copy-button-inset-x: 20px;
    --copy-button-inset-y: 18px;

    margin-left: 0;
    margin-right: 0;
    border-radius: 10px;
    box-shadow: inset 0 0 0 0.5px var(--color-border-code);
  }
`

const Pre = styled.pre`
  color: var(--color-fg-accent-muted);
  line-height: 1.5;
  background-color: var(--color-bg-subtler);
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
    background-color: var(--color-bg-code-highlight);
  }
`

const CopyButton = styled.button`
  position: absolute;
  bottom: var(--copy-button-inset-y);
  right: var(--copy-button-inset-x);
  width: var(--copy-button-size);
  height: var(--copy-button-size);
  cursor: pointer;
  background-color: var(--color-bg-translucent);
  border-radius: 8px;
  box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 0.2),
    0 2px 11px 3px hsl(0deg 0% 0% / 2%), var(--shadow-border-inset-dark);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-bg-translucent-hover);
  }

  transition-property: background-color, opacity, transform;
  transition-duration: 0.15s;

  @media (hover: hover) {
    opacity: 0;
    transform: scale(0.9);

    ${Wrapper}:hover &, 
    &:focus-visible,
    &.copied {
      opacity: 1;
      transform: none;
    }
  }
`

const IconWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  color: var(--color-fg-accent);
`

const CopyIconWrapper = styled(IconWrapper)`
  transition-property: opacity, transform;
  transition-duration: 0.15s;
  transition-delay: 0.15s, 0.15s;

  ${CopyButton}.copied & {
    transform: scale(0.9);
    opacity: 0;

    transition-delay: 0s;
  }

  ${CopyButton}:active & {
    transform: scale(0.9);

    transition-delay: 0s;
  }
`

const CheckMarkIconWrapper = styled(IconWrapper)`
  opacity: 0;

  transition-property: opacity, transform;
  transition-duration: 0.15s;

  ${CopyButton}.copied & {
    transform: none;
    opacity: 1;
  }

  ${CopyButton}:active & {
    transform: scale(0.9);
  }
`

export { CodeBlock }

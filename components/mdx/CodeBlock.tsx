import { CheckMarkIcon } from '@components/icons/CheckMarkIcon'
import { CopyIcon } from '@components/icons/CopyIcon'
import { useTimeout } from '@hooks/useTimeout'
import { statusTimeoutDuration } from '@lib/constants'
import clsx from 'clsx'
import { useNavBar } from 'contexts/nav-bar'
import * as React from 'react'
import styled from 'styled-components'
import { focusRing } from 'styles/focusRing'

type Props = React.PropsWithChildren<{
  title?: string
}>

function CodeBlock(props: Props) {
  const navBar = useNavBar()
  const preElementRef = React.useRef<HTMLPreElement>(null)

  const [hasJustCopied, setHasJustCopied] = React.useState(false)
  const hasJustCopiedTimeout = useTimeout(
    () => setHasJustCopied(false),
    statusTimeoutDuration
  )

  function handleCopyButtonClick() {
    navigator.clipboard?.writeText(preElementRef.current?.textContent ?? '')

    setHasJustCopied(true)
    hasJustCopiedTimeout.start()
    navBar.setStatus('Code copied to clipboard')
  }

  return (
    <Root>
      {props.title && <Title>{props.title}</Title>}
      <Pre ref={preElementRef}>{props.children}</Pre>
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
    </Root>
  )
}

const Root = styled.div`
  --padding-x: 24px;
  --copy-button-size: 32px;
  --copy-button-inset-x: 24px;
  --copy-button-inset-y: 20px;
  --border-radius: 10px;

  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  background-color: var(--color-bg-subtlerer);
  overflow: hidden;

  @media (min-width: 640px) {
    --copy-button-inset-x: 20px;
    --copy-button-inset-y: 18px;

    margin-left: 0;
    margin-right: 0;
    border-radius: var(--border-radius);
  }

  ::after {
    position: absolute;
    content: '';
    inset: 0;
    pointer-events: none;

    box-shadow: inset 0 -1px 0 var(--color-border-code),
      inset 0 1px 0 var(--color-border-code);

    @media (min-width: 640px) {
      box-shadow: inset 0 0 0 1px var(--color-border-code);
      border-radius: var(--border-radius);
    }
  }
`

const Title = styled.div`
  top: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 8px;
  padding-left: var(--padding-x);
  background-color: var(--color-bg-subtlerer);
  color: var(--color-fg-default);
  box-shadow: inset 0 -1px var(--color-border-code);
`

const Pre = styled.pre`
  line-height: 1.6;
  padding-top: 20px;
  padding-bottom: 20px;
  white-space: pre;
  overflow-x: auto;

  & code {
    display: block;
    min-width: fit-content;
  }

  & .line {
    padding-left: var(--padding-x);
    padding-right: calc(
      var(--padding-x) + var(--copy-button-inset-x) + var(--copy-button-size)
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
  box-shadow: 0 2px 11px 3px hsl(0 0% 0% / 0.02),
    0 0 0 1px var(--color-shadow-border),
    inset 0 0 0 1px var(--color-shadow-border-contrast);
  display: flex;
  align-items: center;
  justify-content: center;

  transition-property: opacity, transform;
  transition-duration: 0.15s;

  @media (hover: hover) {
    opacity: 0;
    transform: scale(0.9);

    ${Root}:hover &, 
    &:focus-visible,
    &.copied {
      opacity: 1;
      transform: none;
    }
  }

  --focus-inset: -3px;
  --focus-radius: 11px;

  ${focusRing}
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

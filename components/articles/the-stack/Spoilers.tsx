import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import { focusRing } from 'styles/focusRing'

function Spoilers(props: React.PropsWithChildren<{}>) {
  const [isSpoilerShown, setIsSpoilerShown] = React.useState(false)

  return (
    <Root>
      <Content>{props.children}</Content>
      <Curtain className={clsx({ hidden: isSpoilerShown })}>
        <ShowMeButton onClick={() => setIsSpoilerShown(true)}>
          Let me see
        </ShowMeButton>
      </Curtain>
    </Root>
  )
}

const Root = styled.div`
  --border-radius: 10px;

  position: relative;
  overflow: hidden;
  margin-left: -24px;
  margin-right: -24px;
  min-height: 100px;
  display: flex;
  background-color: var(--color-bg-subtlerer);

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
    border-radius: var(--border-radius);
  }

  &::after {
    pointer-events: none;
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: inset 0 -1px 0 var(--color-border-code),
      inset 0 1px 0 var(--color-border-code);

    @media (min-width: 640px) {
      box-shadow: inset 0 0 0 1px var(--color-border-code);
      border-radius: var(--border-radius);
    }
  }
`

const Content = styled.div`
  padding-left: 24px;
  padding-right: 24px;
`

const Curtain = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-spoiler);
  backdrop-filter: var(--backdrop-filter-vibrant);

  transition-property: opacity, visibility;
  transition-duration: 0.6s;
  transition-delay: 0, 0.6s;

  &.hidden {
    opacity: 0;
    visibility: hidden;
  }
`

const ShowMeButton = styled.button`
  cursor: pointer;
  position: relative;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 14px;
  border-radius: 12px;
  color: var(--color-fg-accent);
  background-color: var(--color-bg-default);
  box-shadow: 0 0 0 1px var(--color-border-code);

  transition-property: transform, opacity;
  transition-duration: 0.15s;

  ${Curtain}.hidden & {
    transform: scale(1.05);
    opacity: 0;
  }

  &:active {
    transform: scale(0.95);
  }

  --focus-inset: -3px;
  --focus-radius: 15px;

  ${focusRing}
`

export { Spoilers }

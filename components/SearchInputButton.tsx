import { useIsFirstRender } from '@hooks/useIsFirstRender'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useOnKeyDown } from '@hooks/useOnKeyDown'
import { useSize } from '@hooks/useSize'
import clsx from 'clsx'
import * as React from 'react'
import styled, { css } from 'styled-components'
import {
  focusRing,
  focusRingBaseStyles,
  focusRingVisibleHoverStyles,
  focusRingVisibleStyles,
} from 'styles/focusRing'
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  isOpen: boolean
  onIsOpenChange: (value: boolean) => void
}

function SearchInputButton(props: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const placeholderRef = React.useRef<HTMLDivElement>(null)
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null)

  const placeholderSize = useSize(placeholderRef)
  const buttonSize = useSize(cancelButtonRef)

  // Focus handling on open state changes. Opening the search moves focus to the
  // input and auto-selects its content (if any). Closing the search returns
  // focus to the button

  const isFirstRender = useIsFirstRender()

  useIsomorphicLayoutEffect(() => {
    if (isFirstRender) return

    if (props.isOpen) {
      inputRef.current?.focus()
      inputRef.current?.select()
    } else {
      buttonRef.current?.focus()
    }
  }, [props.isOpen])

  // Close search on 'Esc' key

  const { onIsOpenChange } = props

  const handleEscapeKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (hasFocus(inputRef.current) || hasFocus(cancelButtonRef.current)) {
        // Prevent the browser exiting full-screen if in that state
        event.preventDefault()
        onIsOpenChange(false)
      }
    },
    [onIsOpenChange]
  )

  useOnKeyDown('Escape', handleEscapeKeyDown, props.isOpen)

  return (
    <Root
      className={clsx({ open: props.isOpen })}
      style={{
        '--default-width': `${placeholderSize.width}px`,
        '--cancel-button-width': `${buttonSize.width}px`,
      }}
    >
      <Placeholder ref={placeholderRef}>
        <SearchIcon />
        {props.placeholder}
      </Placeholder>
      <InputFocusRing>
        <Input
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          ref={inputRef}
          placeholder={props.placeholder}
          tabIndex={props.isOpen ? undefined : -1}
        />
      </InputFocusRing>
      <CancelButton
        ref={cancelButtonRef}
        onClick={() => props.onIsOpenChange(false)}
        tabIndex={props.isOpen ? undefined : -1}
      >
        Cancel
      </CancelButton>
      <Button
        ref={buttonRef}
        onClick={() => props.onIsOpenChange(true)}
        tabIndex={props.isOpen ? -1 : undefined}
      >
        {props.placeholder}
      </Button>
    </Root>
  )
}

const hoverStyles = css`
  background-color: var(--color-bg-subtle-hover);
`

const Root = styled.div`
  --transition: all 0.3s cubic-bezier(0.32, 0.08, 0.24, 1);
  --border-radius: 16px;
  --padding-x: 14px;
  --padding-y: 12px;
  --padding: var(--padding-y) var(--padding-x);
  --icon-size: 20px;
  --starting-font-weight: 500;
  --gap: 6px;

  position: relative;
  display: flex;
  flex: 0 1 var(--default-width);
  will-change: flex-grow;

  transition: var(--transition);

  &.open {
    flex-grow: 1;
  }

  &:not(.open):active {
    transform: scale(0.96);
  }
`

const Placeholder = styled.div`
  color: transparent;
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: var(--gap);
  padding: var(--padding);
  font-weight: var(--starting-font-weight);
`

const SearchIcon = styled(MagnifyingGlassIcon)`
  stroke: var(--color-fg-accent);

  transition: var(--transition);

  ${Root}.open & {
    stroke: var(--color-fg-default);
  }
`

const CancelButton = styled.button`
  position: absolute;
  right: 0;
  height: 100%;
  padding-right: var(--padding-x);
  padding-left: var(--padding-x);
  transform: translateX(-4px);
  cursor: pointer;
  opacity: 0;
  font-weight: 500;
  color: var(--color-fg-accent);
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);

  transition: var(--transition);

  ${Root}.open & {
    transform: none;
    opacity: 1;
  }

  --focus-inset: -2px;
  --focus-radius: 8px 18px 18px 8px;

  ${focusRing}
`

const sharedInputButtonStyle = css`
  position: absolute;
  inset: 0;
  padding: var(--padding);
  padding-left: calc(var(--padding-x) + var(--icon-size) + var(--gap));
  border-radius: var(--border-radius);
`

const defaultTextStyle = css`
  color: var(--color-fg-accent);
  font-weight: var(--starting-font-weight);
`

const openTextStyle = css`
  color: var(--color-fg-default);
  font-weight: 400;
`

const InputFocusRing = styled.div`
  --focus-inset: -2px;
  --focus-radius: 18px;

  &::before {
    ${focusRingBaseStyles}
  }

  &:focus-within::before {
    ${focusRingVisibleStyles}
  }

  @media (hover: hover) {
    &:focus-within:hover::before {
      ${focusRingVisibleHoverStyles}
    }
  }
`

const Input = styled.input`
  ${sharedInputButtonStyle}
  min-width: 0;
  opacity: 0;
  color: var(--color-fg-accent);
  border-radius: var(--border-radius);
  background-color: var(--color-bg-subtle);

  transition: var(--transition);

  @media (hover: hover) {
    &:hover {
      ${hoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${hoverStyles}
  }

  ${Root}.open & {
    opacity: 1;
    padding-right: var(--cancel-button-width);
  }

  &::placeholder {
    ${defaultTextStyle}
    transition: var(--transition);
  }

  ${Root}.open &::placeholder {
    ${openTextStyle}
  }
`

const Button = styled.button`
  ${sharedInputButtonStyle}
  ${defaultTextStyle}
  cursor: pointer;
  border-radius: var(--border-radius);
  background-color: var(--color-bg-subtle);

  transition: var(--transition);

  @media (hover: hover) {
    &:hover {
      ${hoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${hoverStyles}
  }

  ${Root}.open & {
    ${openTextStyle}
    opacity: 0;
    pointer-events: none;
  }

  --focus-inset: -2px;
  --focus-radius: 18px;

  ${focusRing}
`

function hasFocus(element: HTMLElement | null): boolean {
  return document.activeElement === element
}

export { SearchInputButton }

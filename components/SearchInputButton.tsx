import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useOnKeyDown } from '@hooks/useOnKeyDown'
import { useSize } from '@hooks/useSize'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import * as React from 'react'
import styled, { css } from 'styled-components'

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

  useIsomorphicLayoutEffect(() => {
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
      if (hasFocus(inputRef.current)) {
        // Prevent the browser exiting full-screen if in that state
        event.preventDefault()
        onIsOpenChange(false)
      }
    },
    [onIsOpenChange]
  )

  useOnKeyDown('Escape', handleEscapeKeyDown, props.isOpen)

  return (
    <Wrapper
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
      <Input
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        ref={inputRef}
        placeholder={props.placeholder}
        tabIndex={props.isOpen ? undefined : -1}
      />
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
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
  background-color: hsla(0 0% 0% / 0.03);
  border-radius: var(--border-radius);
  will-change: flex-grow;

  transition: var(--transition);

  &.open {
    flex-grow: 1;
  }

  /* TODO: active/hover transitions should be consistent with other links */
  /* TODO: transition only whats needed */

  &:hover,
  &:active {
    background-color: hsla(0 0% 0% / 0.06);
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
  width: var(--icon-size);
  height: var(--icon-size);
  color: black;

  transition: var(--transition);

  ${Wrapper}.open & {
    color: hsla(0 0% 0% / 0.5);
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
  color: black;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);

  /* TODO: look into animations to postpone its appearing when opening, and make
  the hiding quicker when closing */

  transition: var(--transition);

  ${Wrapper}.open & {
    transform: none;
    opacity: 1;
  }
`

const sharedInputButtonStyle = css`
  position: absolute;
  inset: 0;
  padding: var(--padding);
  padding-left: calc(var(--padding-x) + var(--icon-size) + var(--gap));
  border-radius: var(--border-radius);
`

const defaultTextStyle = css`
  color: black;
  font-weight: var(--starting-font-weight);
`

const openTextStyle = css`
  color: hsla(0 0% 0% / 0.3);
  font-weight: 400;
`

const Input = styled.input`
  ${sharedInputButtonStyle}
  min-width: 0;
  opacity: 0;
  color: black;

  transition: var(--transition);

  ${Wrapper}.open & {
    opacity: 1;
    /* TODO: see if it can be delayed (animation keyframes?) */
    padding-right: var(--cancel-button-width);
  }

  &::placeholder {
    ${defaultTextStyle}
    transition: var(--transition);
  }

  ${Wrapper}.open &::placeholder {
    ${openTextStyle}
  }
`

const Button = styled.button`
  ${sharedInputButtonStyle}
  ${defaultTextStyle}
  cursor: pointer;

  transition: var(--transition);

  ${Wrapper}.open & {
    ${openTextStyle}
    opacity: 0;
    pointer-events: none;
  }
`

function hasFocus(element: HTMLElement | null): boolean {
  return document.activeElement === element
}

export { SearchInputButton }

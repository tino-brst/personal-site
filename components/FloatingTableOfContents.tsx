import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'
import { useTableOfContents } from 'contexts/table-of-contents'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { ChevronLeftIcon } from './icons/ChevronLeftIcon'

type Props = {
  isOpen?: boolean
  onSelect?: () => void
}

const FloatingTableOfContents = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const toc = useTableOfContents()

    return (
      <Root className={clsx({ open: props.isOpen })} ref={ref}>
        <Header>In this article</Header>
        <List>
          {toc.items.map((item) => (
            <ListItem
              key={item.id}
              headingId={item.id}
              level={Math.max(item.level - 2, 0)}
              isActive={item.id === toc.activeSectionId}
              isActiveAncestor={
                item.children && toc.activeSectionAncestorIds.includes(item.id)
              }
              onSelect={props.onSelect}
            >
              {item.title}
            </ListItem>
          ))}
        </List>
      </Root>
    )
  }
)

FloatingTableOfContents.displayName = 'FloatingTableOfContents'

type ListItemProps = React.PropsWithChildren<{
  headingId: string
  level: number
  isActive: boolean
  isActiveAncestor: boolean
  onSelect?: () => void
}>

function ListItem(props: ListItemProps) {
  const linkRef = React.useRef<HTMLAnchorElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (linkRef.current === null) return

    if (props.isActive) {
      linkRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [props.isActive])

  return (
    <li>
      <Link
        ref={linkRef}
        className={clsx({
          active: props.isActive,
          activeAncestor: props.isActiveAncestor,
          topLevel: props.level === 0,
        })}
        href={`#${props.headingId}`}
        style={{ '--level': props.level }}
        onClick={props.onSelect}
      >
        {props.children}
        <ActiveListItemIcon />
      </Link>
    </li>
  )
}

const Root = styled.div`
  visibility: hidden;
  pointer-events: auto;
  opacity: 0;
  transform: translateY(8px) scale(0.9);
  transform-origin: bottom right;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 304px;
  border-radius: 14px;
  background: var(--color-bg-translucent);
  backdrop-filter: var(--backdrop-filter-vibrant);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 0px 60px rgba(0, 0, 0, 0.1),
    0 0 0 1px var(--color-shadow-border),
    inset 0 0 0 1px var(--color-shadow-border-contrast);

  transition-property: opacity, transform, visibility;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.25, 1);

  &.open {
    visibility: visible;
    opacity: 1;
    transform: none;
  }
`

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--color-bg-toc-header);
  box-shadow: 0 1px var(--color-shadow-border-subtle),
    inset 0 -0.5px 0 var(--color-shadow-border-contrast);
  color: var(--color-fg-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
`

const List = styled.ol`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;
  padding: 8px;
  scroll-padding-top: 8px;
  scroll-padding-bottom: 8px;
`

const linkHoverStyles = css`
  background-color: var(--color-bg-subtle);
`

const Link = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-fg-default);
  font-size: 16px;
  font-weight: 400;
  padding: 8px;
  padding-left: calc(8px + 16px * var(--level));
  border-radius: 8px;

  transition-property: color, transform, background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  @media (hover: hover) {
    &:hover {
      ${linkHoverStyles}
    }
  }

  &:focus-visible,
  &:active {
    ${linkHoverStyles}
  }

  &:active {
    transform: scale(0.99);
  }

  &.active,
  &.activeAncestor {
    color: var(--color-fg-accent);
  }

  &.topLevel {
    font-weight: 500;
  }

  --focus-inset: -2px;
  --focus-radius: 10px;

  ${focusRing}
`

const ActiveListItemIcon = styled(ChevronLeftIcon)`
  opacity: 0;
  transform: scale(0.5) translateX(-4px);

  transition-property: opacity, transform;
  transition-duration: 0.15s;

  ${Link}.active & {
    opacity: 1;
    transform: none;
  }
`

export { FloatingTableOfContents }

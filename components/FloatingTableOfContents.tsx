import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { useTableOfContents } from 'contexts/table-of-contents'
import * as React from 'react'
import styled from 'styled-components'

type Props = {
  isOpen?: boolean
  onSelect?: () => void
}

const FloatingTableOfContents = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const toc = useTableOfContents()

    return (
      <Wrapper className={clsx({ open: props.isOpen })} ref={ref}>
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
      </Wrapper>
    )
  }
)

FloatingTableOfContents.displayName = 'FloatingTableOfContents'

type ListItemProps = {
  headingId: string
  level: number
  isActive: boolean
  isActiveAncestor: boolean
  children?: React.ReactNode
  onSelect?: () => void
}

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

const Wrapper = styled.div`
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
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 10px 60px rgba(0, 0, 0, 0.1),
    var(--shadow-border), var(--shadow-border-inset-dark);

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
  box-shadow: var(--shadow-border-bottom);
  color: var(--color-fg-subtle);
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

const Link = styled.a`
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

  &:hover,
  &:active {
    background-color: var(--color-bg-subtle);
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
`

const ActiveListItemIcon = styled(ChevronLeftIcon)`
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: scale(0.5) translateX(-4px);

  transition-property: opacity, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${Link}.active & {
    opacity: 1;
    transform: none;
  }
`

export { FloatingTableOfContents }

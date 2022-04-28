import * as React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useTableOfContents } from 'contexts/table-of-contents'
import { ChevronLeftIcon } from '@radix-ui/react-icons'

// Larger Screens Table Of Contents

function AsideTableOfContents() {
  const toc = useTableOfContents()

  return (
    <AsideList>
      {toc.items.map((item) => (
        <AsideListItem
          key={item.id}
          headingId={item.id}
          level={adjustItemLevel(item.level)}
          isActive={item.id === toc.activeSectionId}
          isActiveAncestor={
            item.children && toc.activeSectionAncestorIds.includes(item.id)
          }
        >
          {item.title}
        </AsideListItem>
      ))}
    </AsideList>
  )
}

type AsideListItemProps = {
  headingId: string
  level: number
  isActive: boolean
  isActiveAncestor: boolean
  children?: React.ReactNode
}

function AsideListItem(props: AsideListItemProps) {
  return (
    <li>
      <AsideLink
        className={clsx({
          active: props.isActive,
          activeAncestor: props.isActiveAncestor,
          topLevel: props.level === 0,
        })}
        href={`#${props.headingId}`}
        style={{ '--level': props.level }}
      >
        {props.children}
        {/* TODO: Update icon (bolder) */}
        <AsideActiveLinkIcon width={14} height={14} />
      </AsideLink>
    </li>
  )
}

const AsideList = styled.ol`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const AsideLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  color: hsla(0 0% 0% / 0.5);
  font-size: 14px;
  font-weight: 400;
  margin-left: calc(12px * var(--level));
  padding-top: 8px;
  padding-bottom: 8px;

  transition-property: color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &.topLevel {
    font-weight: 500;
  }

  &.active,
  &.activeAncestor {
    color: hsla(0 0% 0% / 0.8);
  }

  &:hover,
  &:active {
    color: black;
  }
`

const AsideActiveLinkIcon = styled(ChevronLeftIcon)`
  color: black;
  opacity: 0;
  transform: scale(0.5) translateX(-4px);

  transition-property: opacity, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${AsideLink}:hover &, 
  ${AsideLink}:active & {
    opacity: 0.3;
    transform: none;
  }

  ${AsideLink}:active & {
    transform: translateX(-2px);
  }

  ${AsideLink}.active & {
    opacity: 1;
    transform: none;
  }
`

// Smaller Screens Table Of Contents

type TableOfContentsProps = {
  onSelect?: () => void
}

function TableOfContents(props: TableOfContentsProps) {
  const toc = useTableOfContents()

  return (
    <List>
      {toc.items.map((item) => (
        <ListItem
          key={item.id}
          headingId={item.id}
          level={adjustItemLevel(item.level)}
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
  )
}

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
        {/* TODO: Update icon (bolder) */}
        <ActiveLinkIcon width={14} height={14} />
      </Link>
    </li>
  )
}

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
  gap: 4px;
  color: hsla(0 0% 0% / 0.5);
  font-size: 16px;
  font-weight: 400;
  padding: 8px;
  padding-left: calc(8px + 16px * var(--level));
  border-radius: 8px;

  transition-property: color, transform, background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:hover {
    background-color: hsla(0 0% 0% / 0.04);
  }

  &:active {
    background-color: hsla(0 0% 0% / 0.06);
    transform: scale(0.99);
  }

  &.active,
  &.activeAncestor {
    color: hsla(0 0% 0% / 0.8);
  }

  &.topLevel {
    font-weight: 500;
  }
`

const ActiveLinkIcon = styled(ChevronLeftIcon)`
  opacity: 0;
  transform: scale(0.8) translateX(-4px);

  transition-property: opacity, transform;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  ${Link}.active & {
    opacity: 1;
    transform: none;
  }
`

// Utils

/**
 * Level 2 headings are the top-most elements in the table of contents (the only
 * level 1 heading is the article title, which is not included), thus we adjust
 * all heading levels by 2 (2 → 0, 3 → 1, etc).
 */
function adjustItemLevel(level: number): number {
  return Math.max(level - 2, 0)
}

export { AsideTableOfContents, TableOfContents }

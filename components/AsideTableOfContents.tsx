import { ListBulletIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { useTableOfContents } from 'contexts/table-of-contents'
import * as React from 'react'
import styled from 'styled-components'
import { ChevronLeftIcon } from './icons/ChevronLeftIcon'

function AsideTableOfContents() {
  const toc = useTableOfContents()

  return (
    <>
      <Header>
        In this article
        <TableOfContentsIcon />
      </Header>
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
          >
            {item.title}
          </ListItem>
        ))}
      </List>
    </>
  )
}

type ListItemProps = {
  headingId: string
  level: number
  isActive: boolean
  isActiveAncestor: boolean
  children?: React.ReactNode
}

function ListItem(props: ListItemProps) {
  return (
    <li>
      <Link
        className={clsx({
          active: props.isActive,
          activeAncestor: props.isActiveAncestor,
          topLevel: props.level === 0,
        })}
        href={`#${props.headingId}`}
        style={{ '--level': props.level }}
      >
        {props.children}
        <ActiveListItemIcon />
      </Link>
    </li>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-fg-subtle);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
`

const TableOfContentsIcon = styled(ListBulletIcon)`
  width: 18px;
  height: 18px;
`

const List = styled.ol`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const Link = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-fg-default);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  margin-left: calc(12px * var(--level));
  padding-top: 5px;
  padding-bottom: 5px;

  transition-property: color, font-weight;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &.topLevel {
    font-weight: 500;
  }

  &.active {
    font-weight: 500;
  }

  &.active,
  &.activeAncestor {
    color: var(--color-fg-accent-muted);
  }
`

const ActiveListItemIcon = styled(ChevronLeftIcon)`
  color: var(--color-fg-accent-muted);
  opacity: 0;
  transform: scale(0.5) translateX(-4px);

  transition-property: opacity, transform;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  ${Link}:hover &, 
  ${Link}:active & {
    opacity: 0.3;
    transform: none;
  }

  ${Link}:active & {
    transform: translateX(-2px);
  }

  ${Link}.active & {
    opacity: 1;
    transform: none;
  }
`

export { AsideTableOfContents }

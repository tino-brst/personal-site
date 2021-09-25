import clsx from 'clsx'
import { Section } from '@lib/toc'
import { useTableOfContents } from 'contexts/table-of-contents'

function ArticleTableOfContents() {
  const tableOfContents = useTableOfContents()

  return (
    <ul className="toc">
      {/* TODO: title at the top of the list? */}
      {tableOfContents.value.map((item) => (
        <ArticleTableOfContentsItem key={item.id} {...item} />
      ))}
    </ul>
  )
}

function ArticleTableOfContentsItem(props: Section) {
  const tableOfContents = useTableOfContents()
  const isActive = props.id === tableOfContents.activeSectionId
  const isActiveAncestor =
    props.children &&
    tableOfContents.activeSectionAncestorIds.includes(props.id)

  return (
    <>
      <li
        className={clsx(
          isActive && 'active',
          isActiveAncestor && 'active-ancestor'
        )}
        key={props.id}
        style={{ paddingLeft: 15 * Math.max(props.depth - 2, 0) }}
      >
        <a href={`#${props.id}`}>{props.title}</a>
      </li>
      {props.children.map((item) => (
        <ArticleTableOfContentsItem key={item.id} {...item} />
      ))}
    </>
  )
}

export { ArticleTableOfContents }

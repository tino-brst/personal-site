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

  return (
    <>
      <li
        className={isActive ? 'active' : ''}
        key={props.id}
        style={{ paddingLeft: 10 * Math.max(props.depth - 2, 0) }}
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

import { Item } from '@lib/toc'
import { useTableOfContents } from 'contexts/table-of-contents'

function ArticleTableOfContents() {
  const tableOfContents = useTableOfContents()

  return (
    <ul className="toc">
      {/* TODO: title at the top of the list? */}
      {tableOfContents.items.map((item) => (
        <ArticleTableOfContentsItem key={item.slug} {...item} />
      ))}
    </ul>
  )
}

function ArticleTableOfContentsItem(props: Item) {
  const tableOfContents = useTableOfContents()
  const isActive = props.slug === tableOfContents.activeSlug

  return (
    <>
      <li
        className={isActive ? 'active' : ''}
        key={props.slug}
        style={{ paddingLeft: 10 * Math.max(props.depth - 2, 0) }}
      >
        <a href={`#${props.slug}`}>{props.title}</a>
      </li>
      {props.children.map((item) => (
        <ArticleTableOfContentsItem key={item.slug} {...item} />
      ))}
    </>
  )
}

export { ArticleTableOfContents }

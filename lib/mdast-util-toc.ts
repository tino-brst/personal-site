import { Content, Heading, Root } from 'mdast'
import { toString } from 'mdast-util-to-string'
import GitHubSlugger from 'github-slugger'
import { is } from 'unist-util-is'

type PlaceholderRoot = {
  depth: 0
  children: Array<Section>
}

type Section = {
  title: string
  id: string
  depth: 1 | 2 | 3 | 4 | 5 | 6
  children: Array<Section>
}

type TableOfContents = Array<Section>

// TODO: but why? (given -> yields)
function getTableOfContents(document: Root): TableOfContents {
  const slugger = new GitHubSlugger()

  const headings = document.children.filter(isHeading).map((heading) => {
    const title = toString(heading)
    const id = slugger.slug(title)

    return {
      title,
      id,
      depth: heading.depth,
    }
  })

  // TODO: but why? (algorithm)
  const root: PlaceholderRoot = { depth: 0, children: [] }
  const stack = new Stack<PlaceholderRoot | Section>()

  stack.push(root)

  for (const heading of headings) {
    while (stack.top && heading.level <= stack.top.level) {
      stack.pop()
    }

    const section: Section = {
      ...heading,
      children: [],
    }

    stack.top?.children.push(section)
    stack.push(section)
  }

  return root.children
}

/**
 * The only way I found of making TS properly narrow types when doing array
 * operations. Beware that (for some reason), it works only when doing
 * array.filter/find/etc(isHeading) and not
 * array.filter/find/etc(((content) => isHeading(content)).
 */
function isHeading(content: Content): content is Heading {
  return is<Heading>(content, 'heading')
}

/**
 * Basic implementation of the Stack data structure.
 */
class Stack<T> {
  private array: Array<T>

  constructor() {
    this.array = []
  }

  get top(): T | undefined {
    return this.array.length ? this.array[this.array.length - 1] : undefined
  }

  push(value: T) {
    this.array.push(value)
  }

  pop(): T | undefined {
    return this.array.pop()
  }
}

export { getTableOfContents }
export type { TableOfContents, Section }

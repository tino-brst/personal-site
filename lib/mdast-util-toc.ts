import * as Mdast from 'mdast'
import { is } from 'unist-util-is'
import { toString } from 'mdast-util-to-string'
import GitHubSlugger from 'github-slugger'

type Node = {
  level: number
  children: Array<Section>
}

type PlaceholderRoot = Node & {
  level: 0
}

type Section = Node & {
  level: 1 | 2 | 3 | 4 | 5 | 6
  title: string
  id: string
}

/**
 * Get a table of contents representation of the `document`. Uses
 * `github-slugger` to create the ids for each heading based on their content.
 *
 * Given (showing the source markdown file instead of the actual `mdast` nodes
 * for simplicity):
 *
 * ```markdown
 * # Foo
 * ## Bar
 * # Foobar
 * ```
 *
 * Yields:
 *
 * ```ts
 * [
 *   {
 *     title: "Foo",
 *     id: "foo",
 *     level: 1,
 *     children: [
 *       {
 *         title: "Bar",
 *         id: "bar",
 *         level: 2,
 *         children: []
 *       }
 *     ]
 *   },
 *   {
 *     title: "Foobar",
 *     id: "foobar",
 *     level: 1,
 *     children: []
 *   }
 * ]
 * ```
 */
function getTableOfContents(document: Mdast.Root): Array<Section> {
  const slugger = new GitHubSlugger()

  // Get top level document heading nodes
  const headings = document.children.filter(isHeading).map((heading) => {
    const title = toString(heading)
    const id = slugger.slug(title)

    return {
      title,
      id,
      level: heading.depth,
    }
  })

  // Build table of contents tree
  // TODO: but why? (explain algorithm)
  const root: PlaceholderRoot = { level: 0, children: [] }
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

  // Discard the placeholder root and return only its children
  return root.children
}

/**
 * The only way I've found of making TS properly narrow types when doing array
 * operations. Beware that (for some reason), it works only when doing
 * `array.filter/find/etc(isHeading)` and not
 * `array.filter/find/etc(((content) => isHeading(content))`.
 */
function isHeading(content: Mdast.Content): content is Mdast.Heading {
  return is<Mdast.Heading>(content, 'heading')
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
export type { Section }

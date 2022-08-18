import GitHubSlugger from 'github-slugger'
import * as Mdast from 'mdast'
import { toString } from 'mdast-util-to-string'
import * as Unist from 'unist-util-is'

type Node = {
  level: number
  children: Array<Section>
}

type Root = Node & {
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
 * {
 *   level: 0,
 *   children: [
 *     {
 *       title: "Foo",
 *       id: "foo",
 *       level: 1,
 *       children: [
 *         {
 *           title: "Bar",
 *           id: "bar",
 *           level: 2,
 *           children: []
 *         }
 *       ]
 *     },
 *     {
 *       title: "Foobar",
 *       id: "foobar",
 *       level: 1,
 *       children: []
 *     }
 *   ]
 * }
 * ```
 */
function getTableOfContents(document: Mdast.Root): Root {
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
  // NTH but why? (explain algorithm)
  const root: Root = { level: 0, children: [] }
  const stack = new Stack<Root | Section>()

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

  return root
}

/**
 * The only way I've found of making TS properly narrow types when doing array
 * operations. Beware that (for some reason), it works only when doing
 * `array.filter/find/etc(isHeading)` and not
 * `array.filter/find/etc(((content) => isHeading(content))`.
 */
function isHeading(content: Mdast.Content): content is Mdast.Heading {
  return Unist.is<Mdast.Heading>(content, 'heading')
}

/**
 * Basic implementation of the stack data structure.
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

/**
 * Visit all nodes in a tree, invoking the passed callback function on each,
 * with the visited node and its ancestors as arguments.
 */
function visit(
  node: Node,
  onVisit: (node: Node, ancestors: Array<Node>) => void,
  ancestors: Array<Node> = []
) {
  onVisit(node, ancestors)

  for (const child of node.children) {
    visit(child, onVisit, [node, ...ancestors])
  }
}

/**
 * Flattens a tree doing a depth-first traversal.
 */
function flatten(node: Node): Array<Node> {
  const result = [node]

  for (const child of node.children) {
    result.push(...flatten(child))
  }

  return result
}

function isSection(node: Node): node is Section {
  return node.level !== 0
}

export { getTableOfContents, visit, flatten, isSection }
export type { Node, Root, Section }

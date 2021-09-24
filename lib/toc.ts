import { unified } from 'unified'
import { Heading } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { Node } from 'unist'
import { is } from 'unist-util-is'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import GitHubSlugger from 'github-slugger'

// TODO: use normalize?
const processor = unified().use(remarkParse).use(remarkFrontmatter)

type Root = {
  depth: 0
  children: Array<Item>
}

type Item = {
  title: string
  slug: string
  depth: 1 | 2 | 3 | 4 | 5 | 6
  children: Array<Item>
}

type Result = Array<Item>

// TODO: but why? (given -> yields)
function toc(markdown: string): Result {
  const slugger = new GitHubSlugger()
  const root = processor.parse(markdown)

  const headings = root.children.filter(isHeading).map((heading) => {
    const title = toString(heading, { includeImageAlt: false })
    const slug = slugger.slug(title)

    return {
      title,
      slug,
      depth: heading.depth,
    }
  })

  // TODO: but why? (algorithm)
  const tocRoot: Root = { depth: 0, children: [] }
  const stack = new Stack<Item | Root>([tocRoot])

  for (const heading of headings) {
    while (heading.depth <= stack.top.depth) {
      stack.pop()
    }

    const tocItem: Item = {
      title: heading.title,
      slug: heading.slug,
      depth: heading.depth,
      children: [],
    }

    stack.top.children.push(tocItem)
    stack.push(tocItem)
  }

  return tocRoot.children
}

/**
 * For some reason, TS doesn't like the inline .map((node) => is<Heading>(node, 'heading')).
 */
function isHeading(node: Node): node is Heading {
  return is<Heading>(node, 'heading')
}

/**
 * Quick & basic implementation of the Stack data structure.
 */
class Stack<T> {
  private array: Array<T>

  constructor(initialValues: Array<T>) {
    this.array = initialValues
  }

  get top() {
    return this.array[this.array.length - 1]
  }

  push(value: T) {
    this.array.push(value)
  }

  pop(): T | undefined {
    return this.array.pop()
  }
}

export { toc }
export type { Result, Item }

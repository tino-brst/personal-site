import type { Plugin } from 'unified'
import type { Element, Text, Root } from 'hast'
import type { RefractorElement, RefractorRoot, Syntax } from 'refractor'
import { h } from 'hastscript'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'
import { refractor } from 'refractor'
import parseNumericRange from 'parse-numeric-range'

// TODO ? Publish to NPM
// TODO ? Support for // @highlight-start/end/line "directives"

type Options = Partial<{
  // TODO Comments https://github.com/rehypejs/rehype-highlight/blob/3ecd22808c6a73a8aecc7b5fedaf758d721de208/index.js#L8
  languages: Array<Syntax>
  aliases: Record<string, string | Array<string>>
  ignoreMissing: boolean
}>

const rehypePrism: Plugin<[Options?], Root> = (options) => {
  if (options?.languages) {
    for (const language of options.languages) {
      refractor.register(language)
    }
  }

  if (options?.aliases) {
    refractor.alias(options.aliases)
  }

  return (tree) => {
    visit(tree, (node, _, parent) => {
      if (
        !is<Element>(node, { type: 'element', tagName: 'code' }) ||
        !is<Element>(parent, { type: 'element', tagName: 'pre' }) ||
        !node.properties ||
        !Array.isArray(node.properties.className)
      ) {
        return
      }

      const language = getLanguage(node.properties.className)

      if (!language) {
        return
      }

      let refractorRoot: RefractorRoot

      try {
        refractorRoot = refractor.highlight(toString(node), language)
      } catch (error) {
        if (options?.ignoreMissing && /Unknown language/.test(error.message)) {
          return
        }

        throw error
      }

      const nodes = splitNewLines(refractorRoot.children)
      const nodeGroups = groupByLine(nodes)
      let result = nodeGroups.map((group) => h('div.token.line', group))

      if (node.data && node.data.meta && typeof node.data.meta === 'string') {
        const meta = parseMeta(node.data.meta)
        const lineNumbers = parseNumericRange(meta.highlight ?? '')
        result = highlight(result, lineNumbers)
      }

      node.children = result
    })
  }
}

function getLanguage(className: Array<string | number>): string | undefined {
  const [firstClass] = className

  if (
    firstClass &&
    typeof firstClass === 'string' &&
    firstClass.startsWith('language-')
  ) {
    return firstClass.replace('language-', '')
  }
}

/**
 * Returns a copy of the array, where each Text node containing a
 * new-line character is replaced with new ones, splitting its value across
 * them at the new-line characters.
 *
 * The array:
 *
 * ```ts
 * [{ type: 'text', value: 'foo\n\nbar\n' }]
 * ```
 *
 * Yields:
 *
 * ```ts
 * [
 *   { type: 'text', value: 'foo' },
 *   { type: 'text', value: '\n' },
 *   { type: 'text', value: '\n' },
 *   { type: 'text', value: 'bar' },
 *   { type: 'text', value: '\n' }
 * ]
 * ```
 */
function splitNewLines(
  nodes: Array<Text | RefractorElement>
): Array<Text | RefractorElement> {
  const result: Array<Text | RefractorElement> = []

  for (const node of nodes) {
    if (!is<Text>(node, 'text') || !node.value.includes('\n')) {
      result.push(node)
      continue
    }

    // 'foo\n\nbar\n' -> ['foo', '', 'bar', '']
    let textValues = node.value.split('\n')

    // ['foo', '', 'bar', ''] -> ['foo', '\n', '', '\n', 'bar', '\n', '']
    textValues = addBetween(textValues, '\n')

    // ['foo', '\n', '', '\n', 'bar', '\n', ''] -> ['foo', '\n', '\n', 'bar', '\n']
    textValues = textValues.filter((value) => value !== '')

    result.push(...textValues.map(t))
  }

  return result
}

/**
 * Returns a copy of the array with the passed value inserted between all its items.
 *
 * ```ts
 * addBetween([1, 2, 3], 0) // [1, 0 ,2, 0, 3]
 * ```
 */
function addBetween<T>(array: Array<T>, value: T): Array<T> {
  const result: Array<T> = []

  for (const item of array) {
    result.push(item)
    result.push(value)
  }

  result.pop()

  return result
}

/**
 * Goes through all the elements of the array grouping them "by line". As the
 * array is traversed, each element is added to an array (group), whenever a node
 * with a new-line character is found, the group accumulated up to that point is
 * considered a line, stored, and onto building the next group.
 *
 * If a new-line character is found and the accumulated group has no elements at
 * that point, it means that we found an empty line, and a `<br>` element is used as
 * that group's content.
 *
 * The array:
 *
 * ```ts
 * [
 *   { type: 'text', value: 'foo' },
 *   { type: 'text', value: '\n' },
 *   { type: 'text', value: '\n' },
 *   { type: 'text', value: 'bar' },
 *   { type: 'text', value: '\n' }
 * ]
 * ```
 *
 * Yields:
 * ```ts
 * [
 *   [{ type: 'text', value: 'foo' }],
 *   [{ type: 'element', tagName: 'br' }],
 *   [{ type: 'text', value: 'bar' }],
 * ]
 * ```
 */
function groupByLine(
  nodes: Array<Text | RefractorElement>
): Array<Array<Text | RefractorElement | Element>> {
  const result: Array<Array<Text | RefractorElement | Element>> = []
  let lastGroup: Array<Text | RefractorElement | Element> = []

  for (const node of nodes) {
    if (!is<Text>(node, 'text') || node.value !== '\n') {
      lastGroup.push(node)
      continue
    }

    if (lastGroup.length === 0) {
      lastGroup.push(h('br'))
    }

    result.push(lastGroup)
    lastGroup = []
  }

  return result
}

/**
 * Returns a copy of the array, adding the 'highlight' class to all the elements
 * (lines) that have their index (0-based) present in the lineNumbers array
 * (1-based).
 */
function highlight(
  lines: Array<Element>,
  lineNumbers: Array<number>
): Array<Element> {
  const indices = lineNumbers.map((n) => n - 1)
  const result = [...lines]

  for (const index of indices) {
    const lineElement = result[index]

    if (
      !lineElement ||
      !lineElement.properties ||
      !Array.isArray(lineElement.properties.className)
    ) {
      continue
    }

    lineElement.properties.className.push('highlight')
  }

  return result
}

/**
 * Takes a code block's meta string (surfaced by xdm) and turns it into an
 * object (Record) for easier access of its values.
 *
 * This: 'foo=abc bar'
 * Yields: { foo: 'abc', bar: '' }
 *
 * Yep, it could be fancier and make that 'bar' a boolean set to true, parse
 * numbers, etc.
 *
 * All thanks to
 * https://github.com/wooorm/xdm#syntax-highlighting-with-the-meta-field
 */
function parseMeta(meta: string): Partial<Record<string, string>> {
  const result: Record<string, string> = {}
  const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

  let match
  re.lastIndex = 0

  while ((match = re.exec(meta))) {
    result[match[1]] = match[2] || match[3] || match[4] || ''
  }

  return result
}

/**
 * Inspired by the 'h' utility function from 'hastscript' used to create html
 * Element nodes, this one creates Text nodes.
 */
function t(value: string): Text {
  return {
    type: 'text',
    value,
  }
}

export { rehypePrism }

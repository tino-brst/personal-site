import { createStarryNight, Grammar } from '@wooorm/starry-night'
import type { Element, Root, RootContent, Text } from 'hast'
import { toString } from 'hast-util-to-string'
import { h } from 'hastscript'
import parseNumericRange from 'parse-numeric-range'
import type { Plugin } from 'unified'
import { is } from 'unist-util-is'
import { visit } from 'unist-util-visit'

// TODO: Make line class names passable via options
// TODO: ? Publish to NPM
// TODO: ? Support for // @highlight-start/end/line "directives"

type Options = {
  /**
   * Grammars to use. Passed to `createStarryNight()`.
   */
  grammars: Array<Grammar>
  /**
   * Swallow errors for languages with no matching grammar. Defaults to false.
   */
  ignoreMissing?: boolean
}

const rehypeStarryNight: Plugin<[Options], Root> = (options) => {
  const starryNightPromise = createStarryNight(options.grammars)

  return async (tree) => {
    const starryNight = await starryNightPromise

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
      const scope = starryNight.flagToScope(language ?? '')

      // TODO docs docs docs!

      if (!scope) {
        if (!options.ignoreMissing) {
          throw new Error(
            `Unknown language: No scope found for the language '${language}'`
          )
        }

        const nodes = splitNewLines(node.children)
        const nodeGroups = groupByLine(nodes)
        node.children = nodeGroups.map((group) => h('div.line', group))

        return
      }

      const starryNightRoot = starryNight.highlight(toString(node), scope)
      const nodes = splitNewLines(starryNightRoot.children)
      const nodeGroups = groupByLine(nodes)
      const wrapperNodeGroups = nodeGroups.map((group) => h('div.line', group))

      if (node.data && node.data.meta && typeof node.data.meta === 'string') {
        const meta = parseMeta(node.data.meta)
        const lineNumbers = parseNumericRange(meta.highlight ?? '')
        node.children = highlight(wrapperNodeGroups, lineNumbers)

        return
      }

      node.children = wrapperNodeGroups
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
 * ```ts
 * [{ type: 'text', value: 'foo\n\nbar\n' }]
 * ```
 *
 * Yields:
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
function splitNewLines(nodes: Array<RootContent>): Array<Text | Element> {
  const result: Array<Text | Element> = []

  // TODO probably could simplify this to a bunch of maps

  for (const node of nodes) {
    // TODO explain yourself mf
    if (!(is<Text>(node, 'text') || is<Element>(node, 'element'))) {
      continue
    }

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
 * addBetween([1, 2, 3], 0) // [1, 0 , 2, 0, 3]
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
 * Goes through all the elements of the array grouping them _"by line"_. As the
 * array is traversed, each element is added to an array (group), and whenever a
 * node with a new-line character is found, the group accumulated up to that
 * point (and the new-line node) are considered a line, stored, and onto the next
 * group.
 *
 * The array:
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
 *   [
 *     { type: 'text', value: 'foo' },
 *     { type: 'text', value: '\n' },
 *   ],
 *   [
 *     { type: 'text', value: '\n' },
 *   ],
 *   [
 *     { type: 'text', value: 'bar' },
 *     { type: 'text', value: '\n' },
 *   ],
 * ]
 * ```
 *
 * Considering that each group of nodes is later wrapped with a `div` element,
 * keeping those new-line ones may seem superfluous, since the div elements
 * themselves are going to do the work (due to their `display:block` property)
 * of keeping the lines separate. But keeping them allows us to later easily get
 * the content of the code snippet via the element's `textContent` property,
 * with line breaks where they should be (instead of the not so consistent
 * `innerText`). That content can then be used to implement things like 'Copy'
 * buttons no code blocks.
 */
function groupByLine(
  nodes: Array<Text | Element>
): Array<Array<Text | Element>> {
  const result: Array<Array<Text | Element>> = []
  let lastGroup: Array<Text | Element> = []

  for (const node of nodes) {
    if (!is<Text>(node, 'text') || node.value !== '\n') {
      lastGroup.push(node)
      continue
    }

    lastGroup.push(node)
    result.push(lastGroup)
    lastGroup = []
  }

  return result
}

/**
 * Returns a copy of the array, adding the `'highlight'` class to all the elements
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
 * Takes a code block's meta string (surfaced by mdx @ node.data.meta) and turns
 * it into an object (Record) for easier access to its values.
 *
 * This: `foo=abc bar`
 *
 * Yields: `{ foo: 'abc', bar: '' }`
 *
 * Yep, it could be fancier and make that `bar` a boolean set to true, parse
 * numbers, etc.
 *
 * All thanks to
 * https://mdxjs.com/guides/syntax-highlighting/#syntax-highlighting-with-the-meta-field
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
 * Inspired by the `h` utility function from `hastscript` used to create html
 * Element nodes, this one creates Text nodes.
 */
function t(value: string): Text {
  return {
    type: 'text',
    value,
  }
}

export { rehypeStarryNight }

import type { Plugin } from 'unified'
import { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'
import getImageSize from 'image-size'

// TODO: pass root directory as option

const rehypeImageSizes: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (
        !is<Element>(node, { type: 'element', tagName: 'img' }) ||
        !node.properties ||
        typeof node.properties.src !== 'string'
      ) {
        return
      }

      const path = `${process.cwd()}/public${node.properties.src}`
      const size = getImageSize(path)

      node.properties.width = size.width
      node.properties.height = size.height
    })
  }
}

export { rehypeImageSizes }

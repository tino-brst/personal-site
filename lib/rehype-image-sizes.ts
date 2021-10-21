import type { Plugin } from 'unified'
import { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'
import getImageSize from 'image-size'

type Options = Partial<{
  /** Images root directory. Used to build the path for each image `(path = root + image.src`). */
  root: string
}>

const rehypeImageSizes: Plugin<[Options?], Root> = (options) => {
  return (tree) => {
    visit(tree, (node) => {
      if (
        !is<Element>(node, { type: 'element', tagName: 'img' }) ||
        !node.properties ||
        typeof node.properties.src !== 'string'
      ) {
        return
      }

      const imagePath = `${options?.root ?? ''}${node.properties.src}`
      const imageSize = getImageSize(imagePath)

      node.properties.width = imageSize.width
      node.properties.height = imageSize.height
    })
  }
}

export { rehypeImageSizes }

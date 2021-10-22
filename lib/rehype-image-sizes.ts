import type { Plugin } from 'unified'
import { Root } from 'hast'
import { visit } from 'unist-util-visit'
import getImageSize from 'image-size'

/**
 * Adds images' `width` and `height` as props. Useful when dealing with
 * Next.js's Image component.
 *
 * Given a 42 x 24 image:
 * ```html
 * <img src="/image.png" />
 * ```
 *
 * Yields
 * ```html
 * <img src="/image.png" width="42" height="24" />
 * ```
 *
 */
const rehypeImageSizes: Plugin<[], Root> = () => {
  return (tree, file) => {
    visit(tree, { type: 'element', tagName: 'img' }, (image) => {
      if (!image.properties || typeof image.properties.src !== 'string') {
        return
      }

      const imagePath = `${file.cwd}/public${image.properties.src}`
      const { width, height } = getImageSize(imagePath)

      image.properties.width = width
      image.properties.height = height
    })
  }
}

export { rehypeImageSizes }

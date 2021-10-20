import { bundleMDX } from 'mdx-bundler'
import { rehypePrism } from './rehype-prism'
import { rehypeImageSizes } from './rehype-image-sizes'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'

function customBundleMDX(mdxSource: string) {
  return bundleMDX(mdxSource, {
    xdmOptions: (options) => ({
      ...options,
      rehypePlugins: [
        ...(options.rehypePlugins ?? []),
        rehypeImageSizes,
        rehypeSlug,
        [rehypeAutoLinkHeadings, { behaviour: 'wrap' }],
        rehypePrism,
      ],
    }),
  })
}

export { customBundleMDX as bundleMDX }

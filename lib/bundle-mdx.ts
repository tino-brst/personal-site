import { bundleMDX } from 'mdx-bundler'
import { rehypePrism } from './rehype-prism'
import { rehypeImageSizes } from './rehype-image-sizes'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import remarkUnwrapImages from 'remark-unwrap-images'

function customBundleMDX(mdxSource: string) {
  return bundleMDX(mdxSource, {
    xdmOptions: (options) => ({
      ...options,
      remarkPlugins: [...(options.remarkPlugins ?? []), remarkUnwrapImages],
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

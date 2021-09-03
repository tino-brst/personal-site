import { bundleMDX } from 'mdx-bundler'
import { rehypePrism } from './rehype-prism'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'

function customBundleMDX(mdxSource: string) {
  return bundleMDX(mdxSource, {
    xdmOptions: (options) => ({
      ...options,
      rehypePlugins: [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutoLinkHeadings, { behaviour: 'wrap' }],
        rehypePrism,
      ],
    }),
  })
}

export { customBundleMDX as bundleMDX }

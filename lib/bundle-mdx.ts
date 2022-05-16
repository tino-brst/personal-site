import { bundleMDX } from 'mdx-bundler'
import { rehypePrism } from './rehype-prism'
import { rehypeImageSizes } from './rehype-image-sizes'
import rehypeSlug from 'rehype-slug'
import remarkUnwrapImages from 'remark-unwrap-images'

function customBundleMDX(mdxSource: string) {
  return bundleMDX({
    source: mdxSource,
    mdxOptions: (options) => ({
      ...options,
      remarkPlugins: [...(options.remarkPlugins ?? []), remarkUnwrapImages],
      rehypePlugins: [
        ...(options.rehypePlugins ?? []),
        [rehypeImageSizes, { root: `${process.cwd()}/public` }],
        rehypeSlug,
        rehypePrism,
      ],
    }),
  })
}

export { customBundleMDX as bundleMDX }

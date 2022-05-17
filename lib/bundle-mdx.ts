import { bundleMDX } from 'mdx-bundler'
import { rehypePrism } from './rehype-prism'
import { rehypeImageSizes } from './rehype-image-sizes'
import rehypeSlug from 'rehype-slug'
import remarkUnwrapImages from 'remark-unwrap-images'
import js from 'refractor/lang/javascript'
import tsx from 'refractor/lang/tsx'

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
        [rehypePrism, { languages: [js, tsx] }],
      ],
    }),
  })
}

export { customBundleMDX as bundleMDX }

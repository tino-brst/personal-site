import sourceCss from '@wooorm/starry-night/lang/source.css'
import sourceJs from '@wooorm/starry-night/lang/source.js'
import sourceTsx from '@wooorm/starry-night/lang/source.tsx'
import { bundleMDX } from 'mdx-bundler'
import rehypeSlug from 'rehype-slug'
import remarkUnwrapImages from 'remark-unwrap-images'
import { rehypeImageSizes } from './rehype-image-sizes'
import { rehypeStarryNight } from './rehype-starry-night'

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
        [rehypeStarryNight, { grammars: [sourceJs, sourceTsx, sourceCss] }],
      ],
    }),
  })
}

export { customBundleMDX as bundleMDX }

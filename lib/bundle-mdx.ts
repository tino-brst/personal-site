import sourceCss from '@wooorm/starry-night/lang/source.css'
import sourceGfm from '@wooorm/starry-night/lang/source.gfm'
import sourceJs from '@wooorm/starry-night/lang/source.js'
import sourceTsx from '@wooorm/starry-night/lang/source.tsx'
import sourceHtml from '@wooorm/starry-night/lang/text.html.basic'
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
        [
          rehypeStarryNight,
          { grammars: [sourceJs, sourceTsx, sourceCss, sourceGfm, sourceHtml] },
        ],
      ],
    }),
  })
}

export { customBundleMDX as bundleMDX }

import { Wrapper } from '@components/mdx/Wrapper'
import type { ComponentMap } from 'mdx-bundler/client'

import { CodeBlock } from './CodeBlock'
import { Heading2, Heading3, Heading4 } from './Heading'
import { Image } from './Image'

const components: ComponentMap = {
  wrapper: Wrapper,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  pre: CodeBlock,
  img: Image,
}

export { components }

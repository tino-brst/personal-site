import { Wrapper } from '@components/mdx/Wrapper'
import type { ComponentMap } from 'mdx-bundler/client'
import { CodeBlock } from './CodeBlock'
import { FancyQuote } from './FancyQuote'
import { Heading } from './Heading'
import { Image } from './Image'

const components: ComponentMap = {
  wrapper: Wrapper,
  h2: (props) => Heading({ ...props, level: 2 }),
  h3: (props) => Heading({ ...props, level: 3 }),
  h4: (props) => Heading({ ...props, level: 4 }),
  pre: CodeBlock,
  img: Image,
  FancyQuote,
}

export { components }

import type { ComponentMap } from 'mdx-bundler/client'

import { Code } from './Code'
import { CodeBlock } from './CodeBlock'
import { Heading2, Heading3, Heading4 } from './Heading'
import { Image } from './Image'
import { Link } from './Link'
import { Paragraph } from './Paragraph'
import { Strong } from './Strong'

const components: ComponentMap = {
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  p: Paragraph,
  pre: CodeBlock,
  code: Code,
  img: Image,
  a: Link,
  strong: Strong,
}

export { components }

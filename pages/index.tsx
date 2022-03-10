import { Layout } from '@components/Layout'
import styled from 'styled-components'
import { theme } from 'styles/theme'

function HomePage() {
  return (
    <Layout>
      <Heading>Tino&apos;s Corner</Heading>
    </Layout>
  )
}

const Heading = styled.h1`
  color: var(${theme.color.fg});
`

export default HomePage

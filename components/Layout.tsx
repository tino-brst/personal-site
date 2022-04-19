import styled from 'styled-components'
import { NavBar } from './NavBar'

type Props = {
  children: React.ReactNode
}

function Layout(props: Props) {
  return (
    <>
      <NavBar />
      {props.children}
      <Footer />
    </>
  )
}

const Footer = styled.footer`
  height: 300px;
`

export { Layout }

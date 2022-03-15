import { NavBar } from './NavBar'

type Props = {
  children: React.ReactNode
}

function Layout(props: Props) {
  return (
    <>
      <NavBar />
      {props.children}
    </>
  )
}

export { Layout }

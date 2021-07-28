import { Navbar } from './Navbar'

type Props = {
  children: React.ReactNode
}

function Layout(props: Props) {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  )
}

export { Layout }

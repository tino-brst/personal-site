import Link from 'next/link'

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/writing">
            <a>Writing</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export { Navbar }

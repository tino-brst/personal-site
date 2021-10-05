import * as React from 'react'
import Link from 'next/link'
import { ThemePicker } from './ThemePicker'

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
        <ThemePicker />
      </ul>
    </nav>
  )
}

export { Navbar }

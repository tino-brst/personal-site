import * as React from 'react'
import Link from 'next/link'
import { ThemePicker } from './ThemePicker'

// TODO: disable active links? (I'm already at that location, shouldn't be
// clickable). If clickable, maybe scroll to top? Beware that it will set the
// url to /writing and clear any active filters/search.

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

import * as React from 'react'
import Link from 'next/link'
import { useTheme, ActiveTheme } from 'contexts/theme'

function Navbar() {
  const theme = useTheme()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ActiveTheme
    theme.setActive(value)
  }

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
        <li className="theme">
          <select value={theme.active} onChange={handleChange}>
            {theme.values.map((theme) => (
              <option value={theme} onChange={console.log} key={theme}>
                {theme}
              </option>
            ))}
          </select>
          <span className={'theme-resolved'}>({theme.resolved})</span>
        </li>
      </ul>
    </nav>
  )
}

export { Navbar }

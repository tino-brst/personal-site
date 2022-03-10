const theme = {
  color: {
    fg: '--color-fg',
    bg: '--color-bg',
    accent: '--color-accent',
  },
}

/**
 * Usage (on a styled component):
 *
 * ```
 * const Button = styled.button`
 *  color: ${theme.color.fg}
 * `
 * ```
 *
 * All those css custom properties (e.g. --color-fg) must be given a value and
 * kept in sync with the global.css file. Sounds like a PITA,  but we could
 * improve it once we _actually_ use things and find it a PITA.
 *
 * Ideal scenario:
 *
 * Some createTheme function that given an object like so:
 *
 * ```
 * createTheme({
 *  color: {
 *    fg: 'red'
 *  }
 * })
 * ```
 *
 * Creates both the theme object with all the css custom property names
 * (theme.color.fg = '--color-fg'), and injects the styles to the page.
 */

export { theme }

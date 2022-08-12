// Avoids the light theme being shown momentarily before switching to the dark
// one on page load/refresh (i.e. avoids "theme flashing").

const activeTheme = JSON.parse(window.localStorage.getItem('theme'))
const query = '(prefers-color-scheme: dark)'
const isSystemThemeDark = window.matchMedia(query).matches

if (activeTheme === 'dark' || (activeTheme === 'system' && isSystemThemeDark)) {
  document.documentElement.classList.add('dark')
}

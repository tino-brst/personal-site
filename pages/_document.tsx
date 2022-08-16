// Prevents the FOUC of death (https://github.com/vercel/next.js/pull/35163)

import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import Script from 'next/script'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ) as unknown as React.ReactFragment,
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <Script id="theme" strategy="beforeInteractive">
            {`
              // Avoids the light theme being shown momentarily before switching to the dark
              // one on page load/refresh (i.e. avoids "theme flashing").
              
              (function () {
                const activeTheme = JSON.parse(window.localStorage.getItem('theme'))
                const query = '(prefers-color-scheme: dark)'
                const isSystemThemeDark = window.matchMedia(query).matches

                if (activeTheme === 'dark' || (activeTheme === 'system' && isSystemThemeDark)) {
                  document.documentElement.classList.add('dark')
                }
              })()
            `}
          </Script>
        </body>
      </Html>
    )
  }
}

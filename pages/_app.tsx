import '@fontsource/inter/variable-full.css'
import 'normalize.css'
import 'the-new-css-reset/css/reset.css'
import '@wooorm/starry-night/style/core.css'
import '../styles/global.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { fetcher } from '@lib/fetcher'
import { ThemeProvider } from 'contexts/theme'
import { Layout } from '@components/Layout'
import { NavBarProvider } from 'contexts/nav-bar'
import Head from 'next/head'
import { statusTimeoutDuration } from '@lib/constants'
import { DefaultSeo } from 'next-seo'
import { defaultSeoProps } from '@lib/seo'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSeoProps} />
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <SWRConfig value={{ fetcher }}>
        <ThemeProvider>
          <NavBarProvider statusTimeoutDuration={statusTimeoutDuration}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NavBarProvider>
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}

export default App

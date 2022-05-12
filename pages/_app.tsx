import '@fontsource/inter/variable.css'
import 'normalize.css'
import 'the-new-css-reset/css/reset.css'
import '../styles/global.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { fetcher } from '@lib/fetcher'
import { ThemeProvider } from 'contexts/theme'
import { Layout } from '@components/Layout'

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SWRConfig>
  )
}

export default App

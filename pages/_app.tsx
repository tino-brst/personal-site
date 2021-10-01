import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { fetcher } from '@lib/fetcher'

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default App

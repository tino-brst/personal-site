import { DefaultSeoProps } from 'next-seo'

const defaultSeoProps: DefaultSeoProps = {
  titleTemplate: "%s • Tino's Corner",
  defaultTitle: "Tino's Corner",
  description: 'Maker of things, mostly software, mostly UIs',
  openGraph: {
    type: 'website',
    url: 'https://tinoburset.com',
    site_name: "Tino's Corner",
    images: [
      {
        url: 'https://tinoburset.com/images/og.jpg',
        width: 2000,
        height: 1000,
      },
    ],
  },
  twitter: {
    handle: '@bursetAgustin',
    cardType: 'summary_large_image',
  },
}

export { defaultSeoProps }

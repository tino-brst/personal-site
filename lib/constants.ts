const isServerSide = typeof window === 'undefined'

const statusTimeoutDuration = 2000

const Page = {
  home: '/',
  writing: '/writing',
  about: '/about',
  article: (slug: string) => `/writing/${slug}`,
} as const

export { isServerSide, statusTimeoutDuration, Page }

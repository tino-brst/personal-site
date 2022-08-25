import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useNavBar } from 'contexts/nav-bar'
import { useRouter } from 'next/router'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { Footer } from './Footer'
import { NavBar } from './NavBar'

// TODO update Wrappers to Root
// TODO use props with children

function Layout(props: React.PropsWithChildren<{}>) {
  const router = useRouter()
  const navBar = useNavBar()

  // NavBar settings

  useIsomorphicLayoutEffect(() => {
    const isArticlePage = router.pathname.startsWith('/writing/')

    navBar.setIsProgressShown(isArticlePage)
    navBar.setIsAlwaysOpaque(isArticlePage)
  }, [navBar, router.pathname])

  // Skip animations on all but the first page load

  React.useEffect(() => {
    function handleRouteChangeStart() {
      document.documentElement.setAttribute('data-skip-animations', '')
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events])

  return (
    <Wrapper>
      <NavBar />
      <Content>{props.children}</Content>
      <Footer />
      <PS>
        <p>
          p.s. the site&apos;s code is open source and{' '}
          <a href="https://github.com/tino-brst/personal-site">
            available on GitHub
          </a>
        </p>
      </PS>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }
`

const Content = styled.div`
  flex: 1;
  padding-top: ${NavBar.marginBottom}px;
`

const psLinkHoverStyles = css`
  color: var(--color-fg-default-hover);
`

const PS = styled.div`
  background-color: var(--color-bg-subtlerer);
  padding: 8px 16px;

  p {
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 1.6;
    color: var(--color-fg-muted);
  }

  a {
    position: relative;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    color: var(--color-fg-default);

    transition-property: color;
    transition-duration: 0.1s;

    @media (hover: hover) {
      &:hover {
        ${psLinkHoverStyles}
      }
    }

    &:active,
    &:focus-visible {
      ${psLinkHoverStyles}
    }

    --focus-inset: -2px 0;
    --focus-radius: 4px;

    ${focusRing}
  }
`

export { Layout }

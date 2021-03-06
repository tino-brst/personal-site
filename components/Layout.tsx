import { useIsInView } from '@hooks/useIsInView'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useNavBar } from 'contexts/nav-bar'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import styled from 'styled-components'
import { ArrowTopRightIcon } from './icons/ArrowTopRightIcon'
import { NavBar } from './NavBar'
import { Signature } from './Signature'

type Props = {
  children?: React.ReactNode
}

function Layout(props: Props) {
  const router = useRouter()
  const navBar = useNavBar()

  // TODO: I think it makes more sense to have each page state its preference?
  useIsomorphicLayoutEffect(() => {
    const isArticlePage = router.pathname.startsWith('/writing/')

    navBar.setIsProgressShown(isArticlePage)
    navBar.setIsAlwaysOpaque(isArticlePage)
  }, [navBar, router.pathname])

  const signatureRef = React.useRef<SVGSVGElement>(null)
  const isSignatureInView = useIsInView(signatureRef)

  return (
    <Wrapper>
      <NavBar />
      <Content>{props.children}</Content>
      <Footer>
        <LinksWrapper>
          <Link href="https://linkedin.com/in/agustin-burset/" external>
            LinkedIn
          </Link>
          <Link href="https://twitter.com/bursetAgustin" external>
            Twitter
          </Link>
          <Link href="https://github.com/tino-brst" external>
            GitHub
          </Link>
          <Link href="mailto:tinos.corner@icloud.com">Email</Link>
        </LinksWrapper>
        <SignatureLabel>made with care by</SignatureLabel>
        <SignatureWrapper>
          <Signature isDrawn={isSignatureInView} ref={signatureRef} />
        </SignatureWrapper>
      </Footer>
    </Wrapper>
  )
}

type LinkProps = {
  href: string
  external?: boolean
  children?: React.ReactNode
}

function Link(props: LinkProps) {
  return (
    <NextLink href={props.href} passHref>
      <StyledLink target={props.external ? '_blank' : undefined}>
        {props.children}
        {props.external && <ExternalLinkIcon />}
      </StyledLink>
    </NextLink>
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
`

const Footer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  max-width: calc(768px + 2 * 16px);
  margin-top: 48px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 48px;
  padding-bottom: 48px;

  &::before {
    position: absolute;
    top: 0;
    left: 16px;
    right: 16px;
    display: block;
    content: '';
    height: 1px;
    background-color: var(--color-border);
  }

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;

    &::before {
      left: 32px;
      right: 32px;
    }
  }
`

const LinksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
`

const StyledLink = styled.a`
  display: flex;
  gap: 4px;
  font-size: 14px;
  font-weight: 450;
  line-height: 1;
  color: var(--color-fg-default);

  transition-property: color;
  transition-duration: 0.1s;

  &:hover {
    color: var(--color-fg-default-hover);
  }
`

const ExternalLinkIcon = styled(ArrowTopRightIcon)`
  color: var(--color-fg-subtle);

  transition-property: color;
  transition-duration: 0.1s;

  ${StyledLink}:hover & {
    color: var(--color-fg-subtle-hover);
  }
`

const SignatureLabel = styled.label`
  font-size: 12px;
  color: var(--color-fg-subtle);
  font-weight: 500;
  margin-bottom: 12px;
`

const SignatureWrapper = styled.div`
  position: relative;
  aspect-ratio: 5 / 4;
  height: 100px;
  color: var(--color-fg-accent);
`

export { Layout }

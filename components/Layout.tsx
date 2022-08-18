import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { useNavBar } from 'contexts/nav-bar'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { ArrowTopRightIcon } from './icons/ArrowTopRightIcon'
import { NavBar } from './NavBar'
import { Signature } from './Signature'

type Props = {
  children?: React.ReactNode
}

function Layout(props: Props) {
  const router = useRouter()
  const navBar = useNavBar()

  // TODO I think it makes more sense to have each page state its preference?
  useIsomorphicLayoutEffect(() => {
    const isArticlePage = router.pathname.startsWith('/writing/')

    navBar.setIsProgressShown(isArticlePage)
    navBar.setIsAlwaysOpaque(isArticlePage)
  }, [navBar, router.pathname])

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
        <Signature />
      </Footer>
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
  padding-top: ${NavBar.marginBottom}px;
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
  padding-bottom: 44px;

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
  gap: 18px;
  justify-content: center;
  margin-bottom: 48px;
`

const styledLinkHoverStyles = css`
  color: var(--color-fg-default-hover);
`

const StyledLink = styled.a`
  position: relative;
  display: flex;
  gap: 4px;
  font-size: 14px;
  font-weight: 450;
  line-height: 1;
  color: var(--color-fg-default);

  transition-property: color;
  transition-duration: 0.1s;

  @media (hover: hover) {
    &:hover {
      ${styledLinkHoverStyles}
    }
  }

  &:active,
  &:focus-visible {
    ${styledLinkHoverStyles}
  }

  --focus-inset: -6px;
  --focus-radius: 8px;

  ${focusRing}
`
const externalLinkIconHoverStyles = css`
  color: var(--color-fg-muted-hover);
`

const ExternalLinkIcon = styled(ArrowTopRightIcon)`
  color: var(--color-fg-muted);
  margin-right: -1px;

  transition-property: color;
  transition-duration: 0.1s;

  ${StyledLink}:active &, 
  ${StyledLink}:focus-visible & {
    ${externalLinkIconHoverStyles}
  }

  @media (hover: hover) {
    ${StyledLink}:hover & {
      ${externalLinkIconHoverStyles}
    }
  }
`

const SignatureLabel = styled.label`
  font-size: 12px;
  color: var(--color-fg-muted);
  font-weight: 500;
  margin-bottom: 10px;
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

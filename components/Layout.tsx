import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { useNavBar } from 'contexts/nav-bar'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import styled from 'styled-components'
import { NavBar } from './NavBar'

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
        <SignatureImageWrapper>
          <NextImage
            priority
            src="/images/signature.svg"
            layout="fill"
            objectFit="cover"
          />
        </SignatureImageWrapper>
        <SignatureLabel>made with care by</SignatureLabel>
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
    <NextLink href={props.href} passHref={true}>
      <StyledLink target={props.external ? '_blank' : undefined}>
        {props.children}
        {props.external && <ExternalLinkIcon height={14} width={14} />}
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
    background-color: hsla(0 0% 0% / 0.08);
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
  margin-bottom: 24px;
`

const StyledLink = styled.a`
  display: flex;
  gap: 4px;
  font-size: 14px;
  font-weight: 450;
  color: hsla(0 0% 0% / 0.5);

  transition-property: color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:hover {
    color: hsla(0 0% 0% / 0.8);
  }
`

const ExternalLinkIcon = styled(ArrowTopRightIcon)`
  position: relative;
  top: 2px;
  color: hsla(0 0% 0% / 0.3);

  transition-property: color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  ${StyledLink}:hover & {
    color: hsla(0 0% 0% / 0.5);
  }
`

const SignatureLabel = styled.label`
  font-size: 14px;
  color: hsla(0 0% 0% / 0.2);
  font-weight: 400;
  margin-top: 8px;
`

const SignatureImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 5 / 4;
  height: 100px;
`

export { Layout }

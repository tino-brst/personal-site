import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import NextImage from 'next/image'
import NextLink from 'next/link'
import * as React from 'react'
import styled from 'styled-components'
import { NavBar } from './NavBar'

type Props = {
  children?: React.ReactNode
}

function Layout(props: Props) {
  return (
    <Wrapper>
      <NavBar />
      <Content>{props.children}</Content>
      <Footer>
        <ColumnsWrapper>
          {/* TODO: the Column element seems kinda redundant */}
          <Column>
            <LinkGroup>
              <LinkGroupTitle>Site</LinkGroupTitle>
              <Link href="/">Home</Link>
              <Link href="/writing">Writing</Link>
              <Link href="/about">About</Link>
            </LinkGroup>
          </Column>
          <Column>
            <LinkGroup>
              <LinkGroupTitle>Contact</LinkGroupTitle>
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
            </LinkGroup>
          </Column>
        </ColumnsWrapper>
        <SignatureImageWrapper>
          <NextImage
            priority
            src="/images/signature.svg"
            layout="fill"
            objectFit="cover"
          />
        </SignatureImageWrapper>
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
  gap: 16px;
  position: relative;

  max-width: calc(768px + 2 * 16px);
  margin-top: 48px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 48px;
  padding-bottom: 24px;

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
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 48px;
  }
`

const ColumnsWrapper = styled.div`
  display: flex;
  gap: 80px;
`

const Column = styled.div``

const LinkGroup = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const LinkGroupTitle = styled.h3`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: hsla(0 0% 0% / 0.3);
  margin-bottom: 2px;
`

const StyledLink = styled.a`
  display: flex;
  gap: 4px;
  font-size: 14px;
  font-weight: 450;
  color: hsla(0 0% 0% / 0.6);

  transition-property: color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:hover {
    color: hsl(0 0% 0%);
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

const SignatureImageWrapper = styled.div`
  position: relative;
  align-self: flex-end;
  aspect-ratio: 5 / 4;
  height: 100px;
  right: -24px;

  @media (min-width: 640px) {
    align-self: center;
  }
`

export { Layout }

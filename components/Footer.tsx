import { useIsInView } from '@hooks/useIsInView'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import NextLink from 'next/link'
import React from 'react'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'
import { Signature } from './Signature'

function Footer() {
  const ref = React.useRef(null)
  const isInView = useIsInView(ref, {
    once: true,
    viewMargins: '-20px',
  })

  return (
    <Root ref={ref} className={clsx({ show: isInView })}>
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
    </Root>
  )
}

// TODO extract FooterLink
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

const Root = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  opacity: 0;
  transform: translateY(20px);

  transition-property: opacity, transform;
  transition-duration: 0.6s;

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
    transform: scaleX(0);

    transition-property: transform;
    transition-duration: 0.6s;
    transition-delay: 0.2s;
  }

  &.show {
    opacity: 1;
    transform: none;
  }

  &.show::before {
    transform: none;
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

export { Footer }

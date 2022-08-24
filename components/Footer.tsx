import { useIsInView } from '@hooks/useIsInView'
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import { FooterLink } from './FooterLink'
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
        <FooterLink href="https://linkedin.com/in/agustin-burset/" external>
          LinkedIn
        </FooterLink>
        <FooterLink href="https://twitter.com/bursetAgustin" external>
          Twitter
        </FooterLink>
        <FooterLink href="https://github.com/tino-brst" external>
          GitHub
        </FooterLink>
        <FooterLink href="mailto:tinos.corner@icloud.com">Email</FooterLink>
      </LinksWrapper>
      <SignatureLabel>made with care by</SignatureLabel>
      <Signature />
    </Root>
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

const SignatureLabel = styled.label`
  font-size: 12px;
  color: var(--color-fg-muted);
  font-weight: 500;
  margin-bottom: 10px;
`

export { Footer }

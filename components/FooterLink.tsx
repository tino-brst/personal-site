import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import styled, { css } from 'styled-components'
import { focusRing } from 'styles/focusRing'

type Props = {
  href: string
  external?: boolean
}

function FooterLink(props: React.PropsWithChildren<Props>) {
  return (
    <NextLink href={props.href} passHref>
      <Link target={props.external ? '_blank' : undefined}>
        {props.children}
        {props.external && <ExternalLinkIcon />}
      </Link>
    </NextLink>
  )
}

const linkHoverStyles = css`
  color: var(--color-fg-default-hover);
`

const Link = styled.a`
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
      ${linkHoverStyles}
    }
  }

  &:active,
  &:focus-visible {
    ${linkHoverStyles}
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

  ${Link}:active &, 
  ${Link}:focus-visible & {
    ${externalLinkIconHoverStyles}
  }

  @media (hover: hover) {
    ${Link}:hover & {
      ${externalLinkIconHoverStyles}
    }
  }
`

export { FooterLink }

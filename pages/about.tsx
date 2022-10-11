import { EnvelopeIcon } from '@components/icons/EnvelopeIcon'
import { Link } from '@components/Link'
import { getStaggerProps } from '@lib/stagger'
import NextImage from 'next/image'
import styled, { css } from 'styled-components'
import tinoPointingImageSrc from '/public/images/tino-pointing.jpg'
import tinoImageSrc from '/public/images/tino.jpg'

function AboutPage() {
  // BLKD SEO

  return (
    <Root>
      <Title {...getStaggerProps(0)}>About me</Title>
      <CardsContainer {...getStaggerProps(1)}>
        <CardBackground>
          <NextImage
            src={tinoPointingImageSrc}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
          />
        </CardBackground>
        <CardForeground>
          <NextImage
            src={tinoImageSrc}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
          />
        </CardForeground>
      </CardsContainer>
      <Description {...getStaggerProps(2)}>
        <p>
          Hey! Me again, still Tino (short for Agustin). I{`'`}m a Software
          Engineer (the actual degree is <em>Computer Engineer</em>, though I
          {`'`}ve never heard anyone use that title) currently based in{' '}
          <a href="https://goo.gl/maps/pFLEdaBLhE6UZbsr7">
            Bahía Blanca, Argentina
          </a>{' '}
          🇦🇷 (<a href="https://time.is/Bah%C3%ADa_Blanca">UTC -3</a>). I{`'`}ve
          specialized in web-technologies, and particularly enjoy working where
          software and user meet. Where there is a chance to delight ✨, and
          design and attention to detail come into play.
        </p>
        <p>
          During <a href="https://www.uns.edu.ar/">uni</a>, I{`'`}ve worked as
          teaching assistant in courses such as Calculus & Computer Graphics 👨🏻‍🏫,
          where I thoroughly enjoyed trying to make both simple and complex
          topics as accessible as possible (and itch that hopefully this blog
          can scratch). After graduating, I{`'`}ve worked in companies such as{' '}
          <a href="https://www.globant.com">Globant</a>,{' '}
          <a href="https://www.binagora.com">Binagora</a> and{' '}
          <a href="https://www.vectary.com">Vectary</a>, mostly on the front-end
          side of things. Implementing/maintaining component libraries, dealing
          with weird <a href="https://threejs.org/">Three.js</a>-based engines
          {`'`} bugs, creating POCs for various clients, etc. Recently, some of
          the dev things that I{`'`}ve been enjoying using are{' '}
          <a href="https://reactjs.org/">React</a>,{' '}
          <a href="https://www.typescriptlang.org/">TypeScript</a>,{' '}
          <a href="https://www.prisma.io/">Prisma</a> &{' '}
          <a href="https://nextjs.org/">Next.js</a>, to name a few.
        </p>
        <p>
          Regarding non-work stuff, I{`'`}m a fan of the outdoors 🏕, be it going
          for a run, biking (thought I think lately my bike would say otherwise,
          sorry bike), hiking ⛰, et al. I{`'`}ve recently rediscovered my love
          for reading 📚, and you may find me in cafés around the city, using{' '}
          <em>{`"reading"`}</em> as an excuse to try out the coffee & bakery in
          town (for research purposes, of course).
        </p>
      </Description>
      <Contact>
        Feel free to
        <ContactLink
          {...getStaggerProps(3)}
          href="mailto:tinos.corner@icloud.com"
        >
          Contact me
          <EnvelopeIcon />
        </ContactLink>
      </Contact>
    </Root>
  )
}

const Root = styled.div`
  max-width: calc(768px + 2 * 16px);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 4px;

  /* Prevents horizontal scroll due to translate transform on background pic */
  overflow: hidden;

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;
    overflow: unset;
  }
`

const Title = styled.h1`
  color: var(--color-fg-accent);
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 30px;
`

const CardsContainer = styled.div`
  aspect-ratio: 4 / 3;
  display: grid;
  grid-template-columns: 24px 50% auto;
  grid-template-rows: 40% 45% auto;
  margin-left: -24px;
  margin-right: -24px;

  @media (min-width: 640px) {
    aspect-ratio: 9 / 6;
    margin-right: 0;
  }
`

const Card = styled.div`
  --border-radius: 10px;

  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;

  ::after {
    position: absolute;
    border-radius: var(--border-radius);
    content: '';
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px hsla(0 0% 100% / 0.2),
      inset 0 0 0 0.5px hsla(0 0% 0% / 0.2);
  }
`

const CardBackground = styled(Card)`
  grid-column: 2 / -1;
  grid-row: 1 / 3;

  transform: rotate(1deg) translateX(2px);
  box-shadow: 0 0 10px 0 hsla(0 0% 0% / 0.08);
`

const CardForeground = styled(Card)`
  grid-column: 1 / 3;
  grid-row: 2 / -1;

  transform: rotate(-1deg) translateX(-2px);
  box-shadow: 0 0 30px 0 hsla(0 0% 0% / 0.2);
`

const linkHoverStyles = css`
  color: var(--color-link-hover);
  text-decoration-color: var(--color-link-decoration-hover);
  text-decoration-thickness: 2.5px;
`

const Description = styled.div`
  margin-top: 28px;
  color: var(--color-fg-prose);

  p {
    line-height: 1.7;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  em {
    font-variation-settings: 'slnt' -10;
    font-synthesis: none;
  }

  a {
    color: var(--color-fg-accent-muted);
    font-weight: 450;
    border-radius: 4px;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 1px;
    text-decoration-color: var(--color-link-decoration);

    transition-property: text-decoration-color, color;
    transition-duration: 0.15s;

    @media (hover: hover) {
      &:hover {
        ${linkHoverStyles}
      }
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus-ring);
      outline-offset: 2px;
      ${linkHoverStyles}
    }
  }
`

const Contact = styled.div`
  margin-top: 44px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  color: var(--color-fg-default);
  font-size: 14px;
  font-weight: 500;
`

const ContactLink = styled(Link)`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`

export default AboutPage

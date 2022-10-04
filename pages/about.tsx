import { Link } from '@components/Link'
import { getStaggerProps } from '@lib/stagger'
import NextImage from 'next/image'
import styled from 'styled-components'
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
          Dolor irure qui ex nisi sit eiusmod enim ipsum reprehenderit ex
          consequat. Cupidatat duis dolor nulla ut. Eiusmod enim ad consectetur
          labore dolor qui tempor officia eiusmod. Magna reprehenderit ullamco
          nostrud sit consectetur est. Sit aliqua eu mollit laborum ut in
          cupidatat in adipisicing pariatur elit irure sunt fugiat. Incididunt
          tempor ad quis ipsum consequat cupidatat nisi occaecat nulla.
        </p>
        <p>
          Exercitation aute excepteur nulla nostrud. Tempor adipisicing tempor
          sint laboris proident minim quis occaecat irure laborum duis laborum
          laborum.
        </p>
      </Description>
      <StyledLink {...getStaggerProps(3)} href="mailto:tinos.corner@icloud.com">
        Contact me
      </StyledLink>
    </Root>
  )
}

const Root = styled.div`
  max-width: calc(768px + 2 * 16px);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;

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

const Description = styled.div`
  p {
    font-size: 16px;
    color: var(--color-fg-default);
    line-height: 1.5;
    margin-top: 28px;
    margin-bottom: 20px;
  }
`

const StyledLink = styled(Link)`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  margin-top: 32px;
`

export default AboutPage

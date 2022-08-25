import { Link } from '@components/Link'
import { Parallax } from '@components/Parallax'
import NextImage from 'next/image'
import styled from 'styled-components'
import aboutProfileImageSrc from '/public/images/tino.jpg'

function AboutPage() {
  // BLKD SEO
  // BLKD Stagger animations

  return (
    <Root>
      <Title>About me</Title>
      <ImageMask>
        <StyledParallax multiplier={-0.025} clampTo={10}>
          <NextImage src={aboutProfileImageSrc} />
        </StyledParallax>
      </ImageMask>
      <Description>
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
      <StyledLink href="mailto:tinos.corner@icloud.com">Contact me</StyledLink>
    </Root>
  )
}

const Root = styled.div`
  max-width: calc(768px + 2 * 16px);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;

  @media (min-width: 640px) {
    padding-left: 40px;
    padding-right: 40px;
  }
`

const Title = styled.h1`
  color: var(--color-fg-accent);
  font-size: 2.2rem;
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 24px;
`

const ImageMask = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  aspect-ratio: 5 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-subtlerer);
  box-shadow: inset 0 0 0 1px var(--color-shadow-border),
    0 0 0 1px var(--color-shadow-border-contrast);

  @media (min-width: 640px) {
    aspect-ratio: 5 / 3;
  }
`

const StyledParallax = styled(Parallax)`
  position: relative;
  z-index: -1;
  margin-top: -10px;
  margin-bottom: -10px;
`

const Description = styled.div`
  p {
    font-size: 16px;
    color: var(--color-fg-default);
    line-height: 1.5;
    margin-top: 20px;
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

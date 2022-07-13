import { Parallax } from '@components/Parallax'
import NextImage from 'next/image'
import styled from 'styled-components'

type Props = {
  src?: string
  width?: string | number
  height?: string | number
}

function Image(props: Props) {
  return (
    <Wrapper>
      <StyledParallax multiplier={-0.025} clampTo={10}>
        {props.src && (
          <NextImage
            layout="responsive"
            src={props.src}
            width={props.width}
            height={props.height}
          />
        )}
      </StyledParallax>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --border-radius: 10px;

  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: inset 0 -1px 0 var(--color-shadow-border-subtle),
    inset 0 1px 0 var(--color-shadow-border-subtle),
    0 1px var(--color-shadow-border-contrast);

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
    box-shadow: inset 0 0 0 1px var(--color-shadow-border),
      0 0 0 1px var(--color-shadow-border-contrast);
    border-radius: var(--border-radius);
  }
`

const StyledParallax = styled(Parallax)`
  position: relative;
  z-index: -1;
  margin-top: -10px;
  margin-bottom: -10px;
`

export { Image }

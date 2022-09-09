import NextImage from 'next/image'
import styled from 'styled-components'

type Props = {
  src?: string
  width?: string | number
  height?: string | number
}

function Image(props: Props) {
  return (
    <Root>
      {props.src && (
        <NextImage
          layout="responsive"
          src={props.src}
          width={props.width}
          height={props.height}
        />
      )}
    </Root>
  )
}

const Root = styled.div`
  --border-radius: 10px;

  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  overflow: hidden;
  background-color: var(--color-bg-subtlerer);

  &::after {
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: inset 0 -1px 0 var(--color-shadow-border-inset),
      inset 0 1px 0 var(--color-shadow-border-inset);
  }

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
    border-radius: var(--border-radius);

    &::after {
      box-shadow: inset 0 0 0 1px var(--color-shadow-border-inset);
      border-radius: var(--border-radius);
    }
  }
`

export { Image }

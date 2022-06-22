import clsx from 'clsx'
import styled from 'styled-components'

type Axis =
  | {
      vertical: boolean
      horizontal?: never
    }
  | {
      vertical?: never
      horizontal: boolean
    }

type Props = Axis & {
  size: number
}

function Spacer(props: Props) {
  return (
    <Span
      style={{ '--size': `${props.size}px` }}
      className={clsx({
        vertical: props.vertical,
        horizontal: props.horizontal,
      })}
    />
  )
}

const Span = styled.span`
  display: block;
  width: var(--size);
  height: var(--size);

  &.vertical {
    width: 0;
  }

  &.horizontal {
    height: 0;
  }
`

export { Spacer }

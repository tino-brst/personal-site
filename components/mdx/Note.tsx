import clsx from 'clsx'
import styled from 'styled-components'

const knownTypes = ['info', 'warning', 'danger']

type Props = React.PropsWithChildren<{
  title?: string
  type?: 'info' | 'warning' | 'danger'
}>

function Note(props: Props) {
  if (typeof props.type === 'string' && !knownTypes.includes(props.type)) {
    throw new Error(`Unknown article note type '${props.type}'`)
  }

  return (
    <Root className={clsx(['note', props.type])}>
      {props.title && <Title className="title">{props.title}</Title>}
      <Content>{props.children}</Content>
    </Root>
  )
}

const Root = styled.aside`
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 24px;
  margin-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 18px;
  padding-bottom: 20px;

  &.warning {
    color: var(--color-fg-note-warn);
    background: var(--color-bg-note-warn);
    box-shadow: inset 0 1px var(--color-border-note-warn),
      inset 0 -1px var(--color-border-note-warn);
  }

  &.warning {
    color: var(--color-fg-note-warn);
    background: var(--color-bg-note-warn);
    box-shadow: inset 0 1px var(--color-border-note-warn),
      inset 0 -1px var(--color-border-note-warn);
  }

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 10px;

    &.warning {
      box-shadow: inset 0 0 0 1px var(--color-border-note-warn);
    }
  }
`

const Title = styled.div`
  font-size: 1.05em;
  font-weight: 500;
  margin-bottom: 6px;

  ${Root}.warning & {
    color: var(--color-fg-note-title-warn);
  }
`

const Content = styled.div`
  & > *:first-child {
    margin-top: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`

export { Note }

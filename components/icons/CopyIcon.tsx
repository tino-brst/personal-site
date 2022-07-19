import styled from 'styled-components'

type Props = {
  className?: string
}

function CopyIcon(props: Props) {
  return (
    <Root
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="copy-icon-mask">
          <rect width="100%" height="100%" fill="black" />
          <rect
            className="rect-back"
            x="2"
            y="2"
            width="11"
            height="11"
            rx="2"
          />
          <rect
            className="rect-background"
            x="7"
            y="7"
            width="11"
            height="11"
            rx="2"
          />
          <rect
            className="rect-front"
            x="7"
            y="7"
            width="11"
            height="11"
            rx="2"
          />
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#copy-icon-mask)" />
    </Root>
  )
}

const Root = styled.svg`
  color: currentColor;
  stroke-width: 0;
  fill: currentColor;

  mask {
    fill: none;
    stroke: white;
  }

  .rect-back {
    fill: none;
    stroke-width: 1.5;
  }

  .rect-front {
    fill: black;
    stroke-width: 1.5;
  }

  .rect-background {
    stroke-width: 4.5;
    stroke: black;
  }
`

export { CopyIcon }

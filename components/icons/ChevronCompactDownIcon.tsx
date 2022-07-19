import clsx from 'clsx'
import styled from 'styled-components'

type Props = {
  isReversed?: boolean
  className?: string
}

function ChevronCompactDownIcon(props: Props) {
  return (
    <Root
      className={clsx([props.className, { reversed: props.isReversed }])}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="chevron-down-icon-mask">
          <rect width="100%" height="100%" fill="black" />
          <g>
            <path className="left" d="M 5 10 H 10" />
            <path className="right" d="M 10 10 H 15" />
          </g>
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#chevron-down-icon-mask)" />
    </Root>
  )
}

const Root = styled.svg`
  fill: currentColor;
  stroke-width: 0;

  path {
    stroke: white;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    transition: transform 0.15s;
    transform-origin: center;
  }

  path.left {
    transform: rotate(35deg);
  }

  path.right {
    transform: rotate(-35deg);
  }

  g {
    transition: 0.15s;
    transform-origin: center;
    transform: translateY(3px);
  }

  &.reversed {
    path.left {
      transform: rotate(-35deg);
    }

    path.right {
      transform: rotate(35deg);
    }

    g {
      transform: translateY(-0.5px);
    }
  }
`

export { ChevronCompactDownIcon }

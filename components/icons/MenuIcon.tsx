import clsx from 'clsx'
import styled from 'styled-components'

type Props = {
  isOpen: boolean
}

const iconSize = 32
const lineWidth = 18
const d = `M ${iconSize / 2 - lineWidth / 2} ${iconSize / 2} H ${
  iconSize / 2 + lineWidth / 2
}`

function MenuIcon(props: Props) {
  return (
    <Root
      className={clsx({ open: props.isOpen })}
      width={iconSize}
      height={iconSize}
      viewBox={`0 0 ${iconSize} ${iconSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="top">
        <path className="top__line" d={d} />
      </g>
      <g className="bottom">
        <path className="bottom__line" d={d} />
      </g>
    </Root>
  )
}

const Root = styled.svg`
  --transition-duration: 0.1s;
  --offset-y: 4px;

  color: black;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;

  /* Default state [=] */

  .top,
  .bottom {
    transform-origin: center;
    transition-property: transform;
    transition-duration: var(--transition-duration);
    transition-delay: 0s;
    transition-timing-function: ease-in;
  }

  .top__line,
  .bottom__line {
    transition-property: transform;
    transition-duration: var(--transition-duration);
    transition-delay: var(--transition-duration);
    transition-timing-function: ease-out;
  }

  .top__line {
    transform: translateY(calc(-1 * var(--offset-y)));
  }

  .bottom__line {
    transform: translateY(var(--offset-y));
  }

  /* Open state [x] */

  &.open {
    .top,
    .bottom {
      transition-delay: var(--transition-duration);
      transition-timing-function: ease-out;
    }

    .top {
      transform: rotate(45deg);
    }

    .bottom {
      transform: rotate(-45deg);
    }

    .top__line,
    .bottom__line {
      transform: none;

      transition-delay: 0s;
      transition-timing-function: ease-in;
    }
  }
`

export { MenuIcon }

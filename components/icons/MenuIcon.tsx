import clsx from 'clsx'
import styled from 'styled-components'

type Props = {
  isOpen: boolean
}

function MenuIcon(props: Props) {
  return (
    <Root
      className={clsx({ open: props.isOpen })}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="top">
        <path className="top" d="M 7 16 H 25" />
      </g>
      <g className="bottom">
        <path className="bottom" d="M 7 16 H 25" />
      </g>
    </Root>
  )
}

const Root = styled.svg`
  --transition-duration: 0.1s;

  color: black;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;

  /* Default state [=] */

  g.top,
  g.bottom {
    transform-origin: center;
    transition-property: transform;
    transition-duration: var(--transition-duration);
    transition-delay: 0s;
    transition-timing-function: ease-in;
  }

  path.top,
  path.bottom {
    transition-property: transform;
    transition-duration: var(--transition-duration);
    transition-delay: var(--transition-duration);
    transition-timing-function: ease-out;
  }

  path.top {
    transform: translateY(-4px);
  }

  path.bottom {
    transform: translateY(4px);
  }

  /* Open state [x] */

  &.open {
    g.top,
    g.bottom {
      transition-delay: var(--transition-duration);
      transition-timing-function: ease-out;
    }

    g.top {
      transform: rotate(45deg);
    }

    g.bottom {
      transform: rotate(-45deg);
    }

    path.top,
    path.bottom {
      transform: none;

      transition-delay: 0s;
      transition-timing-function: ease-in;
    }
  }
`

export { MenuIcon }

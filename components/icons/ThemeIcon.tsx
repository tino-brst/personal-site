import clsx from 'clsx'
import styled from 'styled-components'

type Props = {
  /** Currently active theme */
  theme?: 'light' | 'dark'
  /** If the theme follows the system's theme */
  isSystemBased?: boolean
}

// TODO tweak rotation speed

const iconSize = 32
const circleRadius = 8.5
const autoSize = 10.5
const autoCenter = 23.5 // i.e. xy center coords = [23, 23]
const autoOffset = autoCenter - autoSize / 2 // xy position coords (i.e. offset from the top-left corner)

function ThemeIcon({ theme = 'light', isSystemBased }: Props) {
  return (
    <Root
      className={clsx({
        dark: theme === 'dark',
        system: isSystemBased,
      })}
      width={iconSize}
      height={iconSize}
      viewBox={`0 0 ${iconSize} ${iconSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="theme-icon-mask">
          <rect width="100%" height="100%" fill="black" />
          <path
            className="semi-circle"
            d={`M ${iconSize / 2} ${
              iconSize / 2 + circleRadius
            } a ${circleRadius} ${circleRadius} 0 0 1 0 -${circleRadius * 2}`}
          />
          <circle className="circle" cx="50%" cy="50%" r={circleRadius} />
          <g className="auto">
            <rect
              className="auto__background"
              x={autoOffset}
              y={autoOffset}
              rx="3"
              ry="3"
              width={autoSize}
              height={autoSize}
            />
            <text
              className="auto__text"
              x={autoCenter}
              y={autoCenter + 0.75}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              S
            </text>
          </g>
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        className="masked"
        mask="url(#theme-icon-mask)"
      />
    </Root>
  )
}

const Root = styled.svg`
  color: black;

  transition-property: color;
  transition-duration: 0.3s;

  mask {
    stroke: white;
    fill: white;
    stroke-width: 0;
  }

  .semi-circle {
    transform-origin: center;
    transform: rotate(45deg);

    transition-property: transform;
    transition-duration: 0.3s;
  }

  .circle {
    stroke: white;
    stroke-width: 2px;
    fill: transparent;
  }

  .auto {
    transform-origin: ${autoCenter}px ${autoCenter}px;
    transform: scale(0);

    transition-property: transform;
    transition-duration: 0.2s;
  }

  .auto__background {
    stroke: black;
    stroke-width: 2px;
  }

  .auto__text {
    font-weight: 800;
    fill: black;
    font-size: 8px;
  }

  .masked {
    fill: currentColor;
  }

  /* Dark theme */

  &.dark {
    color: white;
  }

  &.dark .semi-circle {
    transform: rotate(225deg);
  }

  /* System based */

  &.system .auto {
    transform: scale(1);
  }
`

export { ThemeIcon }

import clsx from 'clsx'
import styled from 'styled-components'

const badgeRadius = 3
const badgeCenterX = 17
const badgeCenterY = 5

type Props = {
  hasBadge: boolean
}

function FilterIcon(props: Props) {
  return (
    <Root
      className={clsx({ badgeVisible: props.hasBadge })}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="filter-icon-mask">
          <rect width="100%" height="100%" fill="white" />
          <circle
            className="badge badge_mask"
            cx={badgeCenterX}
            cy={badgeCenterY}
            r={badgeRadius}
          />
        </mask>
      </defs>
      <g mask="url(#filter-icon-mask)">
        <path className="line" d="M 3 5 L 17 5" />
        <path className="line" d="M 6 10 L 14 10" />
        <path className="line" d="M 9 15 L 11 15" />
      </g>
      <circle
        className="badge"
        cx={badgeCenterX}
        cy={badgeCenterY}
        r={badgeRadius}
      />
    </Root>
  )
}

const Root = styled.svg`
  color: black;
  fill: none;
  stroke-width: 0;
  stroke-linecap: round;
  stroke: currentColor; // main color

  .line {
    stroke-width: 2;
  }

  .badge {
    fill: grey; // secondary color
    transform: scale(0);
    transform-origin: ${badgeCenterX}px ${badgeCenterY}px;

    transition-property: transform;
    transition-duration: 0.2s;

    &_mask {
      stroke-width: 4;
      fill: black;
      stroke: black;
    }
  }

  &.badgeVisible .badge {
    transform: scale(1);
  }
`

export { FilterIcon }

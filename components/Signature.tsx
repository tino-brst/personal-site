import { useIsInView } from '@hooks/useIsInView'
import clsx from 'clsx'
import * as React from 'react'
import styled from 'styled-components'

// TODO Make it accessible (wrap in button, focus ring, etc)

function Signature() {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useIsInView(ref, {
    threshold: 1,
    once: true,
  })

  return (
    <Root>
      <SVG
        ref={ref}
        className={clsx({ drawn: isInView })}
        height="100%"
        width="100%"
        viewBox="0 0 117.211 107.685"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient-path-1">
            <stop offset="0%" stopOpacity={1} />
            <stop offset="40%" stopOpacity={0.7} />
            <stop offset="100%" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="gradient-path-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopOpacity={1} />
            <stop offset="10%" stopOpacity={0.8} />
            <stop offset="100%" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="gradient-path-4" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopOpacity={1} />
            <stop offset="10%" stopOpacity={0.8} />
            <stop offset="90%" stopOpacity={0.6} />
            <stop offset="100%" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <path
          className="path path_1"
          pathLength="1"
          stroke="url(#gradient-path-1)"
          d="M42.4039 30.7527C42.4039 29.271 43.374 36.3263 43.4728 37.1661C43.933 41.0776 44.107 45.0119 44.5417 48.924C45.9681 61.762 45.763 75.7474 49.8862 88.1171"
        />
        <path
          className="path path_2"
          pathLength="1"
          stroke="url(#gradient-path-2)"
          d="M63.782 57.119C63.782 59.5229 64.1005 61.8809 64.4946 64.245C64.849 66.3719 65.1428 68.199 65.5635 70.3021C65.8476 71.7228 66.2343 73.1845 66.6324 74.5777C66.8081 75.1927 67.0589 76.9313 67.345 76.3592C68.997 73.0551 64.2715 57.4753 71.6206 57.4753C74.6801 57.4753 76.9998 68.9984 77.6777 71.371C78.1016 72.8546 79.5741 75.3869 81.597 74.5777C85.3878 73.0614 93.4971 55.2654 91.5734 51.4181C89.8054 47.8822 84.2266 49.1674 81.9533 51.0618C78.5207 53.9224 75.8962 58.6729 75.8962 63.1761"
        />
        <path
          className="path path_3"
          pathLength="1"
          d="M62.3568 46.0736C62.1192 46.1924 61.8817 46.3112 61.6442 46.4299"
        />
        <path
          className="path path_4"
          pathLength="1"
          stroke="url(#gradient-path-4)"
          d="M13.1872 62.1072C14.7012 60.5932 16.7502 59.7318 18.5317 58.5442C25.6415 53.8043 32.8227 49.2581 40.2661 45.0047C55.788 36.1351 70.9092 26.6546 86.9415 18.6385"
        />
      </SVG>
    </Root>
  )
}

const Root = styled.div`
  height: 100px;
  aspect-ratio: 5 / 4;
  color: var(--color-fg-accent);
  cursor: pointer;
  user-select: none;
  will-change: transform;

  transition-property: transform;
  transition-duration: 0.15s;

  &:active {
    transform: scale(0.9);
  }
`

const SVG = styled.svg`
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1 1.1;

  .path {
    opacity: 0;
    stroke-dashoffset: 1;

    transition-property: opacity, stroke-dashoffset;
    transition-timing-function: ease-in, cubic-bezier(0.19, 1, 0.22, 1);
  }

  &.drawn .path {
    opacity: 0.8;
    stroke-dashoffset: 0;
  }

  .path_1 {
    transition-duration: 0.1s, 0.6s;
    transition-delay: 0;
  }

  .path_2 {
    transition-timing-function: ease-in, cubic-bezier(0.23, 0.21, 0.58, 0.96);
    transition-duration: 0.1s, 0.9s;
    transition-delay: 0.4s;
  }

  .path_3 {
    transition-duration: 0.1s, 0s;
    transition-delay: 1.3s;
  }

  .path_4 {
    transition-duration: 0.1s, 0.7s;
    transition-delay: 1.8s;
  }

  stop {
    stop-color: currentColor;
  }

  ${Root}:active & .path {
    stroke-dashoffset: 1;
    opacity: 0;

    transition-delay: 0s;
    transition-duration: 0.2s;
  }
`

export { Signature }

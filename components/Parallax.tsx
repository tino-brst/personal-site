import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'

// TODO enable only while visible? (using intersection observer)

type Props = {
  /** translationY = offset * multiplier */
  multiplier?: number
  /** Limit translation values to the range [-clampTo, clampTo] (in pixels) */
  clampTo?: number
  /** For styled-components compatibility */
  className?: string
}

function Parallax(props: React.PropsWithChildren<Props>) {
  const ref = React.useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return

    const element = ref.current

    function updateOffset() {
      element.style.setProperty('--offset', `${getCenterOffsetY(element)}px`)
    }

    window.addEventListener('scroll', updateOffset, { passive: true })
    window.addEventListener('resize', updateOffset, { passive: true })

    updateOffset()

    return () => {
      window.removeEventListener('scroll', updateOffset)
      window.removeEventListener('resize', updateOffset)
    }
  }, [])

  return (
    <Wrapper
      className={clsx(props.className, { clamped: props.clampTo })}
      ref={ref}
      style={{
        '--multiplier': props.multiplier ?? 0,
        '--translate-limit': props.clampTo ? `${props.clampTo}px` : 0,
      }}
    >
      {props.children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --offset: 0;
  --multiplier: 0;
  --translate-limit: 0;
  --translate-min: calc(-1 * var(--translate-limit));
  --translate-max: var(--translate-limit);

  transform: translateY(calc(var(--offset) * var(--multiplier)));

  &.clamped {
    transform: translateY(
      clamp(
        var(--translate-min),
        calc(var(--offset) * var(--multiplier)),
        var(--translate-max)
      )
    );
  }
`

function getCenterOffsetY(element: HTMLElement): number {
  const { y, height } = element.getBoundingClientRect()

  const elementCenterY = y + height / 2
  const windowCenterY = window.innerHeight / 2

  return elementCenterY - windowCenterY
}

export { Parallax }

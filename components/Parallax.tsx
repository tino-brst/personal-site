import { useIsInView } from '@hooks/useIsInView'
import { useIsomorphicLayoutEffect } from '@hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'
import * as React from 'react'
import styled from 'styled-components'

type Props = {
  /** translationY = offset * multiplier */
  multiplier?: number
  /** Limit translation values to the range [-clampTo, clampTo] (in pixels) */
  clampTo?: number
  /** Customize the function used to compute the vertical offset (in pixels). Defaults to using the element and window centers as reference points */
  getOffset?: (element: HTMLElement) => number
  /** For styled-components compatibility */
  className?: string
}

function Parallax({
  multiplier = 0,
  clampTo,
  getOffset = defaultGetOffset,
  className,
  children,
}: React.PropsWithChildren<Props> = {}) {
  const ref = React.useRef<HTMLDivElement>(null)
  // TODO add margins
  const isInView = useIsInView(ref)

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !isInView) return

    const element = ref.current

    function updateOffset() {
      element.style.setProperty('--offset', `${getOffset(element)}px`)
    }

    window.addEventListener('scroll', updateOffset, { passive: true })
    window.addEventListener('resize', updateOffset, { passive: true })

    updateOffset()

    return () => {
      window.removeEventListener('scroll', updateOffset)
      window.removeEventListener('resize', updateOffset)
    }
  }, [getOffset, isInView])

  return (
    <Root
      className={clsx(className, { clamped: clampTo })}
      ref={ref}
      style={{
        '--multiplier': multiplier,
        '--translate-limit': clampTo ? `${clampTo}px` : 0,
      }}
    >
      {children}
    </Root>
  )
}

const Root = styled.div`
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

function defaultGetOffset(element: HTMLElement): number {
  const { top, height } = element.getBoundingClientRect()

  const elementCenterY = top + height / 2
  const viewportCenterY = window.innerHeight / 2

  return elementCenterY - viewportCenterY
}

export { Parallax }

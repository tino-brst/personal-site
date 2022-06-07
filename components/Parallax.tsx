import React from 'react'
import styled from 'styled-components'

type Props = {
  multiplier?: number
  className?: string
}

function Parallax(props: React.PropsWithChildren<Props>) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (!ref.current) return

    const element = ref.current

    function handleScroll() {
      element.style.setProperty('--offset', `${getCenterOffsetY(element)}px`)
    }

    window.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Wrapper
      className={props.className}
      ref={ref}
      style={{ '--multiplier': props.multiplier ?? 0 }}
    >
      {props.children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --offset: 0;
  --multiplier: 0;
  /* TODO should get these via props */
  --translate-min: -10px;
  --translate-max: 10px;

  transform: translateY(
    clamp(
      var(--translate-min),
      calc(var(--offset) * var(--multiplier)),
      var(--translate-max)
    )
  );
`

function getCenterOffsetY(element: HTMLElement): number {
  const { y, height } = element.getBoundingClientRect()

  const elementCenterY = y + height / 2
  const windowCenterY = window.innerHeight / 2

  return elementCenterY - windowCenterY
}

export { Parallax }

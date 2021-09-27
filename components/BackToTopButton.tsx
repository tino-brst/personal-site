import * as React from 'react'

type Props = {
  children?: React.ReactNode
}

function BackToTopButton(props: Props) {
  const [isPastThreshold, setIsPastThreshold] = React.useState(false)

  React.useEffect(() => {
    const handleScrollOrResize = () => {
      const threshold = window.innerHeight
      setIsPastThreshold(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScrollOrResize, { passive: true })
    window.addEventListener('resize', handleScrollOrResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [])

  return (
    <>
      {isPastThreshold && (
        <button
          {...props}
          onClick={() => {
            window.scroll({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </>
  )
}

export { BackToTopButton }

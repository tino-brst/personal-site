import * as React from 'react'

type Props = {
  children?: React.ReactNode
}

function BackToTopButton(props: Props) {
  const [isPastThreshold, setIsPastThreshold] = React.useState(false)

  React.useEffect(() => {
    const handleScrollOrResize = () => {
      // "Use a Back to Top button for pages that are longer than 4 screens"
      // https://www.nngroup.com/articles/back-to-top/
      const threshold = window.innerHeight * 4
      setIsPastThreshold(window.scrollY > threshold)
    }

    window.addEventListener('resize', handleScrollOrResize, { passive: true })
    window.addEventListener('scroll', handleScrollOrResize, { passive: true })

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

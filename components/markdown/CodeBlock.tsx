import * as React from 'react'

type Props = {
  children?: React.ReactNode
}

function CodeBlock(props: Props) {
  const preElementRef = React.useRef<HTMLPreElement>(null)

  const handleClick = () => {
    const preTextContent = preElementRef.current?.textContent ?? ''
    navigator.clipboard.writeText(preTextContent)
  }

  return (
    <div>
      <pre {...props} ref={preElementRef} />
      <button onClick={handleClick}>Copy</button>
    </div>
  )
}

export { CodeBlock }

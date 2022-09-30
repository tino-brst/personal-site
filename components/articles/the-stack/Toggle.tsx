import React from 'react'
import styled from 'styled-components'

function Toggle() {
  const [isOn, setIsOn] = React.useState(false)

  return (
    <Root
      onClick={() => setIsOn((value) => !value)}
      data-checked={isOn ? '' : null}
    >
      <Thingy />
    </Root>
  )
}

const Root = styled.button`
  --padding: 3px;
  --size: 24px;

  cursor: pointer;
  display: block;
  margin-top: 32px;
  margin-bottom: 32px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  width: calc(2 * (var(--size) + var(--padding)));
  height: calc(2 * var(--padding) + var(--size));
  background-color: var(--color-bg-toggle);
  border-radius: calc(var(--size) + var(--padding));
  overflow: hidden;

  transition-property: background-color;
  transition-duration: 0.3s;

  &[data-checked] {
    background-color: hsl(135 59% 49%);
  }
`

const Thingy = styled.div`
  position: absolute;
  top: var(--padding);
  left: var(--padding);
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-color: white;
  box-shadow: 0 0 0 1px hsla(0 0% 0% / 0.03), 0 4px 8px hsla(0 0% 0% / 0.1);

  transition-property: transform;
  transition-duration: 0.2s;

  ${Root}[data-checked] & {
    transform: translateX(var(--size));
  }
`

export { Toggle }

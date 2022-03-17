import styled from 'styled-components'

const Spacer = styled.div<{ minLength?: number }>`
  flex: 1 0 ${({ minLength }) => minLength ?? 0}px;
`

export { Spacer }

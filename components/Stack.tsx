import styled from 'styled-components'

const alignValue = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
}

const Stack = styled('div').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !['spacing'].includes(prop) && defaultValidatorFn(prop),
})<{
  spacing?: number
  align?: keyof typeof alignValue
}>`
  display: flex;
  gap: ${({ spacing }) => (spacing ? `${spacing}px` : null)};
  align-items: ${({ align }) => (align ? alignValue[align] : null)};
`

const HStack = styled(Stack)``

const VStack = styled(Stack)`
  flex-direction: column;
`

export { HStack, VStack }

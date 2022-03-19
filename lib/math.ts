function map(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number]
): number {
  const result =
    (value - inputRange[0]) *
      ((outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0])) +
    outputRange[0]

  return Math.max(Math.min(outputRange[1], result), outputRange[0])
}

export { map }

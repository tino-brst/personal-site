/**
 * Adds/removes (toggles) a value to/from an array
 */
function toggle<T>(array: Array<T>, value: T): Array<T> {
  const valueIndex = array.findIndex((item) => item === value)

  return valueIndex < 0
    ? [...array, value]
    : [...array.slice(0, valueIndex), ...array.slice(valueIndex + 1)]
}

/**
 * Checks if an array contains all given values
 *
 * ```ts
 * includesEvery([1,2,3], [1])   // true
 * includesEvery([1,2,3], [1,4]) // false
 * ```
 */
function includesEvery<T>(array: Array<T>, values: Array<T>): boolean {
  return values.every((value) => array.includes(value))
}

export { toggle, includesEvery }

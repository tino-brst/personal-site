/**
 * Creates a copy of an object with just the given keys/properties.
 *
 * ```ts
 * pick({ a: 1, b: 2 }, ['a']) // → { a: 1 }
 * ```
 */
function pick<
  T extends Record<string | number | symbol, any>,
  K extends keyof T
>(object: T, keys: K[]): Pick<T, K> {
  const entries = keys.map((key) => [key, object[key]])
  return Object.fromEntries(entries)
}

export { pick }

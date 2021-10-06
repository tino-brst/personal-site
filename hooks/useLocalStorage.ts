import * as React from 'react'
import { isServerSide } from '@lib/constants'

type Options<T> = Partial<{
  /** Function used when saving a value to storage. Defaults to `JSON.stringify` */
  serialize: (value: T) => string
  /** Function used when retrieving a value from storage. Defaults to `JSON.parse` */
  deserialize: (value: string) => T
}>

/**
 * Just like useState, but the value is persisted to local storage with the
 * given key, and kept up-to-date with changes made from other tabs/windows.
 *
 * Inspired by https://usehooks.com/useLocalStorage
 */
function useLocalStorage<T>(
  /** Storage key */
  key: string,
  /** Value used when no value is found in storage for the given key. Deleting the storage entry (from another tab/window) sets the returned value to this one */
  initialValue: T,
  { serialize = JSON.stringify, deserialize = JSON.parse }: Options<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState(() => {
    if (isServerSide) return initialValue

    const storageValue = window.localStorage.getItem(key)
    const value = isEmpty(storageValue)
      ? initialValue
      : deserialize(storageValue)

    return value
  })

  // Handle key (& initialValue/deserialize) changes
  React.useEffect(() => {
    const storageValue = window.localStorage.getItem(key)
    const value = isEmpty(storageValue)
      ? initialValue
      : deserialize(storageValue)

    setValue(value)
  }, [key, initialValue, deserialize])

  // Subscribe to storage changes
  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return

      const storageValue = event.newValue
      const value = isEmpty(storageValue)
        ? initialValue
        : deserialize(storageValue)

      setValue(value)
    }

    // Beware that the storage event (in some browsers) only fires when a
    // storage area has been modified from another document (i.e. another
    // window/tab). That's why making changes to the storage directly on the
    // devtools may not trigger an update.
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue, deserialize])

  // Just like any setState function (can receive a value or a function that
  // gets the current value as parameter), but commits each state change to
  // storage.
  const customSetValue = React.useCallback<
    React.Dispatch<React.SetStateAction<T>>
  >(
    (value) => {
      setValue((prevValue) => {
        const newValue = value instanceof Function ? value(prevValue) : value
        window.localStorage.setItem(key, serialize(newValue))

        return newValue
      })
    },
    [key, serialize]
  )

  return [value, customSetValue]
}

function isEmpty(value: unknown): value is null {
  return value === null
}

export { useLocalStorage }

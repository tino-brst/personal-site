import * as React from 'react'
import { isServerSide } from '@lib/constants'

type Options<T> = Partial<{
  serialize: (value: T) => string
  deserialize: (value: string) => T
}>

/**
 * Just like useState, but the value is persisted on local storage with the
 * given key, and kept up-to-date with changes made from other tabs/windows. The
 * initial value is set to what's already in storage, if anything. Otherwise,
 * it's set to initialValue.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
  { serialize = JSON.stringify, deserialize = JSON.parse }: Options<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const shouldSkipStorageUpdate = React.useRef(false)
  const [value, setValue] = React.useState(() => {
    if (isServerSide) return initialValue

    const storageValue = window.localStorage.getItem(key)
    const value = isEmpty(storageValue)
      ? initialValue
      : deserialize(storageValue)

    // If the returned initial state came from the storage, there is no need to
    // update the storage with that same value.
    shouldSkipStorageUpdate.current = !isEmpty(storageValue)
    return value
  })

  // Update the state on key/deserialize/initialValue changes
  React.useEffect(() => {
    const storageValue = window.localStorage.getItem(key)
    const value = isEmpty(storageValue)
      ? initialValue
      : deserialize(storageValue)

    setValue(value)
    shouldSkipStorageUpdate.current = !isEmpty(storageValue)
  }, [key, deserialize, initialValue])

  // Subscribe to storage changes
  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return

      const storageValue = event.newValue
      const value = isEmpty(storageValue)
        ? initialValue
        : deserialize(storageValue)

      setValue(value)

      // Mixed feelings on this one. Skipping the next update when the new state
      // _came_ from the storage makes sense (no need to write back the same
      // value), but what should be done when the entry is deleted? (rawValue
      // === null). The state is set to initialValue (makes sense, I would
      // expect my "dark" theme to go back to "light" if I deleted the "theme"
      // entry in storage), but should the storage be updated to reflect that?
      // (i.e. not skip). Feels weird deleting an entry from the dev tools and
      // have it instantly reappear set to the initialValue. And even though not
      // updating it (skipping) may cause the state value to not represent
      // what's in storage, it's temporary; an update to the state or
      // page-refresh would get them back in sync. Skipping it is.
      shouldSkipStorageUpdate.current = true
    }

    // Beware that the storage event (in some browsers) only fires when a
    // storage area has been modified from another document (i.e. another
    // window/tab). That's why making changes to the storage directly on the
    // devtools may not trigger an update.
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }, [key, deserialize, initialValue])

  // On changes to the state, update the corresponding storage value (if
  // needed). The placement of this effect is intentional, to make sure that any
  // changes to shouldSkipStorageUpdate happen before it (on a given render).
  React.useEffect(() => {
    if (shouldSkipStorageUpdate.current) {
      shouldSkipStorageUpdate.current = false
      return
    }

    window.localStorage.setItem(key, serialize(value))
  }, [value, key, serialize])

  return [value, setValue]
}

function isEmpty(value: unknown): value is null {
  return value === null
}

export { useLocalStorage }

import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import * as React from 'react'

type Value = ParsedUrlQuery extends Record<string, infer U> ? U : never
type SetValue = React.Dispatch<
  React.SetStateAction<string | Array<string> | undefined>
>

// TODO: document that setting the value to undefined clears it from the url

// Next.js doesn't export these 😒
type TransitionOptions = Partial<{
  /** Update the path of the current page without rerunning `getStaticProps`, `getServerSideProps` or `getInitialProps`. Defaults to `true` */
  shallow: boolean
  /** Optional string, indicates locale of the new page */
  locale: string | false
  /** Controls scrolling to the top of the page after navigation. Defaults to `true` */
  scroll: boolean
}>

type Options = Partial<{
  /** Used when the parameter with the given name is not available */
  fallbackValue: string | Array<string>
  /** Prevents adding a new entry into the history stack when updating the parameter value (i.e. use `router.replace` instead of `router.push`). Defaults to `true` */
  replace: boolean
  /** Next.js's `router.push/replace` options */
  transitionOptions: TransitionOptions
}>

// To show the function's description for each overload on autocompletion, it
// looks like it must be specified on each of them, even if it's exactly the
// same in all 😒

/**
 * Drop-in replacement to accessing Next.js `router.query` URL search
 * parameters, with the possibility of updating their values (just like
 * `React.useState`).
 */
function useQueryParam(name: string): [Value, SetValue]

/**
 * Drop-in replacement to accessing Next.js `router.query` URL search
 * parameters, with the possibility of updating their values (just like
 * `React.useState`).
 */
function useQueryParam(
  name: string,
  options?: Omit<Options, 'fallbackValue'> & {
    fallbackValue: string | Array<string>
  }
): [NonNullable<Value>, SetValue]

/**
 * Drop-in replacement to accessing Next.js `router.query` URL search
 * parameters, with the possibility of updating their values (just like
 * `React.useState`).
 */
function useQueryParam(name: string, options?: Options): [Value, SetValue]

function useQueryParam(
  /** Same as used in `URLSearchParams.get(name)` */
  name: string,
  {
    fallbackValue,
    replace = true,
    transitionOptions = { shallow: true },
  }: Options = {}
): [Value, SetValue] | [NonNullable<Value>, SetValue] {
  const router = useRouter()
  const prevValue = React.useRef<Value>()

  const value = React.useMemo<Value>(() => {
    if (router.isReady) {
      return router.query[name] ?? fallbackValue
    }

    // As soon as the page loads, the router is not ready and hasn't populated
    // its query object yet (router.query = {}), even though there may be
    // parameters in the URL readily available at router.asPath

    const [pathname] = router.asPath.split('?')
    const search = searchMap.get(pathname)
    const searchParams = new URLSearchParams(search)
    const searchParamValues = searchParams.getAll(name)

    // The returned parameter value mimics the behavior of accessing it from the
    // router.query object

    // URL                  router.query.foo
    // -------------------------------------
    // '...?'               undefined
    // '...?foo'            ''
    // '...?foo='           ''
    // '...?foo=12'         '12'
    // '...?foo=12&foo=34'  ['12', '34']

    return searchParamValues.length === 0
      ? fallbackValue
      : searchParamValues.length === 1
      ? searchParamValues[0]
      : searchParamValues
  }, [router.isReady, router.asPath, router.query, name, fallbackValue])

  const setValue = React.useCallback<SetValue>(
    (value) => {
      const [pathname] = router.asPath.split('?')
      const search = searchMap.get(pathname)
      const searchParams = new URLSearchParams(search)

      const newValue =
        value instanceof Function ? value(prevValue.current) : value

      prevValue.current = newValue

      if (newValue === undefined) {
        searchParams.delete(name)
      }

      if (newValue instanceof Array) {
        searchParams.delete(name)

        for (const item of newValue) {
          if (typeof item === 'string') {
            searchParams.append(name, item)
          }
        }
      }

      if (typeof newValue === 'string') {
        searchParams.set(name, newValue)
      }

      const url = isEmpty(searchParams)
        ? pathname
        : `${pathname}?${searchParams}`

      searchMap.set(pathname, searchParams.toString())

      if (replace) {
        router.replace(url, undefined, transitionOptions)
      } else {
        router.push(url, undefined, transitionOptions)
      }
    },
    [name, replace, router, transitionOptions]
  )

  prevValue.current = value

  return [value, setValue]
}

const searchMap = new Map<string, string>()

function isEmpty(iterable: Iterable<any>): boolean {
  return iterable[Symbol.iterator]().next().done ?? true
}

export { useQueryParam }

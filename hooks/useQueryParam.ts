import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import * as React from 'react'

type QueryParam = ParsedUrlQuery extends Record<string, infer U> ? U : never

/**
 * Drop-in replacement to accessing Next.js `router.query` URL search
 * parameters, with the possibility of updating their values (just like
 * `React.useState`).
 */
function useQueryParam(
  name: string
): [QueryParam, (value: string | Array<string> | undefined) => void]

/**
 * Drop-in replacement to accessing Next.js `router.query` URL search
 * parameters, with the possibility of updating their values (just like
 * `React.useState`).
 */
function useQueryParam(
  name: string,
  fallbackValue: string | Array<string>
): [
  NonNullable<QueryParam>,
  (value: string | Array<string> | undefined) => void
]

function useQueryParam(
  /** Same as used in `URLSearchParams.get(name)` */
  name: string,
  /** Used when the parameter with the given name is not available, i.e. `router.query.foo ?? fallbackValue` */
  fallbackValue?: string | Array<string>
):
  | [QueryParam, (value: string | Array<string> | undefined) => void]
  | [NonNullable<QueryParam>, (value: string | undefined) => void] {
  const router = useRouter()

  const value = React.useMemo(() => {
    if (router.isReady) {
      return router.query[name] ?? fallbackValue
    }

    // As soon as the page loads, the router is not ready and hasn't populated
    // its query object yet (router.query = {}), even though there may be
    // parameters in the URL readily available at router.asPath

    const [_, search] = router.asPath.split('?')
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
  }, [router.isReady, router.query, router.asPath, name, fallbackValue])

  const setValue = React.useCallback<
    React.Dispatch<React.SetStateAction<string | Array<string> | undefined>>
  >(
    (valueMaybeFunction) => {
      const [pathname, search] = router.asPath.split('?')
      const searchParams = new URLSearchParams(search)

      const newValue =
        valueMaybeFunction instanceof Function
          ? valueMaybeFunction(value)
          : valueMaybeFunction

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

      router.replace(url)
    },
    [name, router, value]
  )

  return [value, setValue]
}

function isEmpty(iterable: Iterable<any>): boolean {
  return iterable[Symbol.iterator]().next().done ?? true
}

export { useQueryParam }

import * as React from 'react'
import useSWR from 'swr'

function useLikeCount(slug: string) {
  const { data, error, mutate } = useSWR<{
    totalLikeCount: number
    userLikeCount: number
  }>(`/api/likes/${slug}`)

  const updateUserLikeCount = React.useCallback(() => {
    mutate(async (data) => {
      const updatedUserLikeCount = data?.userLikeCount ?? 0
      const response = await fetch(
        `/api/likes/${slug}?count=${updatedUserLikeCount}`,
        { method: 'POST' }
      )
      const updatedData = await response.json() // TODO set types
      return updatedData
    }, false)
  }, [mutate, slug])

  const debouncedUpdateUserLikeCount = React.useMemo(
    () => debounce(updateUserLikeCount, 500),
    [updateUserLikeCount]
  )

  const increment = () => {
    mutate(
      (data) => ({
        totalLikeCount: (data?.totalLikeCount ?? 0) + 1,
        userLikeCount: (data?.userLikeCount ?? 0) + 1,
      }),
      false
    )

    debouncedUpdateUserLikeCount()
  }

  return {
    // TODO define return type and add to function definition?
    increment,
    total: data?.totalLikeCount,
    user: data?.userLikeCount,
    isLoading: !data && !error,
    isError: error !== undefined,
  }
}

function debounce(fn: any, duration: number) {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, duration)
  }
}

export { useLikeCount }

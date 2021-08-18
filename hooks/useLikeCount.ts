import useSWR from 'swr'

function useLikeCount(slug: string) {
  const { data, error, mutate } = useSWR<{
    totalLikeCount: number
    userLikeCount: number
  }>(`/api/likes/${slug}`)

  // TODO 🚩 debounce 🤔

  const increment = () => {
    mutate(
      (data) => ({
        totalLikeCount: (data?.totalLikeCount ?? 0) + 1,
        userLikeCount: (data?.userLikeCount ?? 0) + 1,
      }),
      false
    )

    mutate(async (data) => {
      const updatedUserLikeCount = data?.userLikeCount ?? 0
      const response = await fetch(
        `/api/likes/${slug}?count=${updatedUserLikeCount}`,
        { method: 'POST' }
      )
      const updatedData = await response.json() // TODO set types
      return updatedData
    }, false)
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

export { useLikeCount }

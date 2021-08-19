import useSWR from 'swr'
import { useDebounce } from './useDebounce'

function useLikeCount(slug: string) {
  const { data, error, mutate } = useSWR<{
    totalLikeCount: number
    userLikeCount: number
  }>(`/api/likes/${slug}`)

  const debouncedMutate = useDebounce(mutate, 1000)

  const increment = () => {
    mutate(
      (data) => ({
        totalLikeCount: (data?.totalLikeCount ?? 0) + 1,
        userLikeCount: (data?.userLikeCount ?? 0) + 1,
      }),
      false
    )

    debouncedMutate(async (data) => {
      const response = await fetch(
        `/api/likes/${slug}?count=${data?.userLikeCount ?? 0}`,
        { method: 'POST' }
      )
      return await response.json()
    }, false)
  }

  return {
    // TODO define return type and add to function definition?
    increment,
    total: data?.totalLikeCount,
    user: data?.userLikeCount,
    isLoading: !data && !error,
  }
}

export { useLikeCount }

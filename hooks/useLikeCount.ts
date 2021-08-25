import useSWR from 'swr'
import { useDebounce } from './useDebounce'
import { maxUserLikeCount } from 'lib/constants'

  const { data, error, mutate } = useSWR<{
    totalLikeCount: number
    userLikeCount: number
  }>(`/api/likes/${slug}`)
type UseLikeCountResult = {
  increment: () => void
  total: number | undefined
  user: number | undefined
  isLoading: boolean
}

function useLikeCount(slug: string): UseLikeCountResult {

  const debouncedMutate = useDebounce(mutate, 1000)

  const increment = () => {
    // Update the local data immediately (allows the UI to reflect the change
    // instantaneously). Revalidation is disabled to avoid an unnecessary fetch,
    // which we'll handle next.
    mutate((data) => {
      if (data && data.userLikeCount < maxUserLikeCount) {
        return {
          totalLikeCount: data.totalLikeCount + 1,
          userLikeCount: data.userLikeCount + 1,
        }
      }
    }, false)

    // Send the request (debounced) to update the user's like count in the
    // source, and update the local copy with the returned (updated) value.
    // Revalidation is disabled once again, since we're already getting the
    // latest value from the POST request and returning it.
    debouncedMutate(async (data) => {
      if (data) {
        const response = await fetch(
          `/api/likes/${slug}?count=${data.userLikeCount}`,
          { method: 'POST' }
        )

        return await response.json()
      }
    }, false)
  }

  return {
    increment,
    total: data?.totalLikeCount,
    user: data?.userLikeCount,
    isLoading: !data && !error,
  }
}

export { useLikeCount }

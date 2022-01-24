import * as React from 'react'
import useSWR from 'swr'
import { debounce } from '@lib/debounce'
import { LikesResponseData } from 'pages/api/likes/[slug]'

type UseLikeCountResult = {
  toggleUserLike: () => void
  hasUserLike: boolean | undefined
  value: number | undefined
  isLoading: boolean
}

function useLikeCount(slug: string): UseLikeCountResult {
  const { data, error, mutate } = useSWR<LikesResponseData>(
    `/api/likes/${slug}`
  )

  const toggleUserLike = React.useCallback(async () => {
    mutate((data) => {
      if (data === undefined) return

      // Update the local data immediately (giving the user instant feedback).
      // Revalidation is disabled to avoid an unnecessary request, which is
      // handled next.
      return data.hasUserLike
        ? {
            hasUserLike: false,
            likeCount: data.likeCount - 1,
          }
        : {
            hasUserLike: true,
            likeCount: data.likeCount + 1,
          }
    }, false)

    // Send the request to update the user's like status, and update
    // the local value with the returned (updated) one.
    try {
      await mutate(async (data) => {
        if (data === undefined) return

        return debouncedUpdateUserLike(slug, data.hasUserLike)

        // 👇 Revalidation is disabled once again, since the request already
        // returns the updated data.
      }, false)
    } catch {
      // If there was an error while updating the user like, trigger a
      // revalidation to set our local data back to the latest valid data (since
      // we updated it locally to give the user feedback, assuming there weren't
      // going to be any errors).
      mutate()
    }
  }, [mutate, slug])

  return {
    value: data?.likeCount,
    hasUserLike: data?.hasUserLike,
    toggleUserLike,
    isLoading: !data && !error,
  }
}

const debouncedUpdateUserLike = debounce(updateUserLike, 1000)

async function updateUserLike(slug: string, value: boolean) {
  const response = await fetch(`/api/likes/${slug}`, {
    method: value ? 'PUT' : 'DELETE',
  })

  // TODO: error handling
  if (response.ok) {
    return response.json()
  }
}

export { useLikeCount }

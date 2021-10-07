import * as React from 'react'
import useSWR from 'swr'
import { maxUserLikeCount } from '@lib/constants'
import { debounce } from '@lib/debounce'
import { LikesResponseData } from 'pages/api/likes/[slug]'

type UseLikeCountResult = {
  increment: () => void
  total: number | undefined
  user: number | undefined
  isLoading: boolean
}

function useLikeCount(slug: string): UseLikeCountResult {
  const { data, error, mutate } = useSWR<LikesResponseData>(
    `/api/likes/${slug}`
  )

  const increment = React.useCallback(async () => {
    // Update the local data immediately (giving the user instant feedback).
    // Revalidation is disabled to avoid an unnecessary request, which is
    // handled next.
    mutate((data) => {
      if (data && data.userLikeCount < maxUserLikeCount) {
        return {
          totalLikeCount: data.totalLikeCount + 1,
          userLikeCount: data.userLikeCount + 1,
        }
      }
    }, false)

    // Send the request (debounced) to update the user's like count, and update
    // the local value with the returned (updated) one.
    try {
      await mutate(async (data) => {
        if (data && data.userLikeCount) {
          return debouncedUpdateLikeCount(slug, data.userLikeCount)
        }
      }, false)
      // 👆 Revalidation is disabled once again, since the request already
      // returns the updated data.
    } catch {
      // If there was an error while updating the like count, trigger a
      // revalidation to set our local data back to the latest valid data (since
      // we updated it locally to give the user feedback, assuming there weren't
      // going to be any errors).
      mutate()
    }
  }, [mutate, slug])

  return {
    increment,
    total: data?.totalLikeCount,
    user: data?.userLikeCount,
    isLoading: !data && !error,
  }
}

const debouncedUpdateLikeCount = debounce(updateLikeCount, 1000)

async function updateLikeCount(slug: string, value: number) {
  const response = await fetch(`/api/likes/${slug}?count=${value}`, {
    method: 'POST',
  })

  // TODO: error handling
  if (response.ok) {
    return await response.json()
  }
}

export { useLikeCount }

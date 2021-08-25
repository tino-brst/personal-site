import * as React from 'react'
import useSWR from 'swr'

// As soon as we visit a page, we want to register the new view, and get the
// total (previous visits + ours). By default, useSWR will do a fetch to get the
// views, but that first value we get is off by one, since it's not taking into
// account our visit. We want to skip that default first request
// ({revalidateOnMount: false }), and do a POST instead, which is gonna register
// the new view and return the right view count. With that, we can trigger a
// data update via mutate (skipping revalidation once again, since it's an
// up-to-date value).

  const { data, error, mutate } = useSWR<{ viewCount: number }>( // TODO share API types
    `/api/views/${slug}`,
    { revalidateOnMount: false }
  )
type UseViewCountResult = {
  value?: number
  isLoading: boolean
}

function useViewCount(slug: string): UseViewCountResult {

  React.useEffect(() => {
    mutate(async () => {
      const response = await fetch(`/api/views/${slug}`, { method: 'POST' })
      // TODO set types
      // TODO error handling
      return await response.json()
    }, false)
  }, [slug, mutate])

  return {
    value: data?.viewCount,
    isLoading: !data && !error,
  }
}

export { useViewCount }

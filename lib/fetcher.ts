async function fetcher<T = any>(url: string): Promise<T> {
  return fetch(url).then((res) => res.json())
}

export { fetcher }

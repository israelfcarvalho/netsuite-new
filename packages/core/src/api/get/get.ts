export async function apiGet<TData>(url: string): Promise<TData> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  return fetch(url, {
    headers,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`)
    }

    return res.json()
  })
}

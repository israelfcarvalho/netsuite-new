import { errorMiddleware } from '../_common/error/utils'
import { responseMiddleware } from '../_common/utils'

export async function apiGet<TData>(url: string): Promise<TData> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  return fetch(url, {
    headers,
  })
    .then((res) => responseMiddleware<TData>(res))
    .catch(errorMiddleware)
}

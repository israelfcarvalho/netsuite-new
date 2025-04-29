import { errorMiddleware } from '../_common/error/utils'
import { responseMiddleware } from '../_common/utils'

export async function apiPost<TData, TBody>(url: string, body: TBody): Promise<TData> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => responseMiddleware<TData>(res))
    .catch(errorMiddleware)
}

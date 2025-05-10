import { useMutation } from '@tanstack/react-query'

import { apiPost } from './post'
import { ApiBody, IUseApiPost } from './types'
import { QueryParams, UseApiOptions } from '../_common/types'
import { mountUrl } from '../_common/utils'
import { useApi } from '../provider/Provider'

export function createApiPost(baseUrl: string) {
  return function useApiPost<TData, TBody extends ApiBody, Q extends QueryParams = QueryParams, TError = Error>(
    route: string,
    options?: UseApiOptions<Q>
  ): IUseApiPost<TData, TBody, TError> {
    useApi(useApiPost.name, baseUrl)
    const url = mountUrl(baseUrl, route, options?.queryParams)

    const {
      data,
      error,
      mutate: post,
      isPending,
    } = useMutation<TData, TError, TBody>({
      mutationKey: [url],
      mutationFn: (body) => apiPost<TData, TBody>(url, body),
    })

    return {
      data,
      error,
      isPending,
      post,
    }
  }
}

/**
 * @deprecated This function is deprecated and will be removed in the next major version.
 * Please use 'createUseApiPost' instead.
 */
export function useApiPost<TData, TBody extends ApiBody, Q extends QueryParams = QueryParams, TError = Error>(
  route: string,
  options?: UseApiOptions<Q>
): IUseApiPost<TData, TBody, TError> {
  const { baseUrl } = useApi(useApiPost.name)
  const url = mountUrl(baseUrl, route, options?.queryParams)

  const {
    data,
    error,
    mutate: post,
    isPending,
  } = useMutation<TData, TError, TBody>({
    mutationKey: [url],
    mutationFn: (body) => apiPost<TData, TBody>(url, body),
  })

  return {
    data,
    error,
    isPending,
    post,
  }
}

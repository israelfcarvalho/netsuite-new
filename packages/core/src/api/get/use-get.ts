import { useQuery } from '@tanstack/react-query'

import { QueryParams, UseApiOptions } from '../_common/types'
import { mountUrl } from '../_common/utils'
import { useApi } from '../provider'
import { apiGet } from './get'
import { IUseApiGet } from './types'

export function createApiGet(baseUrl: string) {
  return function useApiGet<TData, Q extends QueryParams = QueryParams, TError = Error>(
    route: string,
    options?: UseApiOptions<Q, TData, TError>
  ): IUseApiGet<TData, TError> {
    useApi(useApiGet.name, baseUrl)

    const url = mountUrl(baseUrl, route, options?.queryParams)

    const { data, error, isLoading, refetch } = useQuery<TData, TError>({
      queryKey: [url],
      queryFn: () => apiGet<TData>(url),
      ...(options?.queryOptions ?? {}),
    })

    return {
      data,
      error,
      isLoading,
      refetch,
    }
  }
}

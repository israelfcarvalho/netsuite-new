import { UseQueryOptions } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

export type QueryParams = Record<string, string | boolean | number | undefined>

export interface UseApiOptions<Q extends QueryParams = QueryParams, TData = unknown, TError = unknown> {
  queryParams?: Q
  isPublic?: boolean
  queryOptions?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
}

export type ApiMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface ApiContext {
  baseUrl: string
}

export interface ProviderProps extends PropsWithChildren, ApiContext {}

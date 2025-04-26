'use client'

import { useApiGet } from '@workspace/core/api'

import { DivisionApiResponse, DivisionQueryParams } from './types'
import { environments } from '../../environments'

const {
  api: {
    division: { deploy, script, route },
  },
} = environments

export function useGetDivisions() {
  const { data, error, isLoading, refetch } = useApiGet<DivisionApiResponse, DivisionQueryParams>(route, {
    queryParams: {
      script,
      deploy,
    },
  })

  return {
    data: data?.data ?? [],
    error,
    isLoading,
    refetch,
  }
}

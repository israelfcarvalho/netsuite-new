'use client'

import { useApiGet } from '@workspace/core/api'

import { CostTypeApiResponse, CostTypeQueryParams, UseGetCostTypesProps } from './types'
import { environments } from '../../environments'

const {
  api: {
    costType: { deploy, script, route },
  },
} = environments

export function useGetCostTypes({ costCodeId }: UseGetCostTypesProps) {
  const { data, error, isLoading, refetch } = useApiGet<CostTypeApiResponse, CostTypeQueryParams>(route, {
    queryOptions: { enabled: Boolean(costCodeId) },
    queryParams: {
      script,
      deploy,
      costCodeId,
    },
  })

  return {
    data: data?.data ?? [],
    error,
    isLoading,
    refetch,
  }
}

'use client'

import { CostTypeApiResponse, CostTypeQueryParams, UseGetCostTypesProps } from './types'
import { environments } from '../../environments'

import { useListReportApiGet } from '@/lib/api/_common'

const {
  api: {
    costType: { deploy, script, route },
  },
} = environments

export function useGetCostTypes({ costCodeId }: UseGetCostTypesProps) {
  const { data, error, isLoading, refetch } = useListReportApiGet<CostTypeApiResponse, CostTypeQueryParams>(route, {
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

'use client'

import { CostCodeApiResponse, CostCodeQueryParams, UseGetCostCodesProps } from './types'
import { environments } from '../../environments'

import { useListReportApiGet } from '@/lib/api/_common'
const {
  api: {
    costCode: { deploy, script, route },
  },
} = environments

export function useGetCostCodes({ divisionId }: UseGetCostCodesProps = {}) {
  const { data, error, isLoading, refetch } = useListReportApiGet<CostCodeApiResponse, CostCodeQueryParams>(route, {
    queryOptions: { enabled: divisionId !== undefined },
    queryParams: {
      script,
      deploy,
      divisionId,
    },
  })

  return {
    data: data?.data ?? [],
    error,
    isLoading,
    refetch,
  }
}

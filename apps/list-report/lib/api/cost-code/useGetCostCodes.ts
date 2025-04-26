'use client'

import { useApiGet } from '@workspace/core/api'

import { CostCodeApiResponse, CostCodeQueryParams, UseGetCostCodesProps } from './types'
import { environments } from '../../environments'

const {
  api: {
    costCode: { deploy, script, route },
  },
} = environments

export function useGetCostCodes({ divisionId }: UseGetCostCodesProps = {}) {
  const { data, error, isLoading, refetch } = useApiGet<CostCodeApiResponse, CostCodeQueryParams>(route, {
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

'use client'

import { DivisionApiResponse, DivisionQueryParams } from './types'
import { environments } from '../../environments'

import { useListReportApiGet } from '@/lib/api/_common'
const {
  api: {
    division: { deploy, script, route },
  },
} = environments

export function useGetDivisions() {
  const { data, error, isLoading, refetch } = useListReportApiGet<DivisionApiResponse, DivisionQueryParams>(route, {
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

'use client'

import { RanchBlockApiResponse, RanchBlockQueryParams } from './types'
import { environments } from '../../environments'

import { useListReportApiGet } from '@/lib/api/_common'

const {
  api: {
    ranchBlock: { deploy, script, route },
  },
} = environments

const GET_RANCH_BLOCKS_ACTION = 'by-hierarchy'

export function useGetRanchBlocks(parentId?: string) {
  const { data, error, isLoading, refetch } = useListReportApiGet<RanchBlockApiResponse, RanchBlockQueryParams>(route, {
    queryParams: {
      script,
      deploy,
      parentId,
      action: GET_RANCH_BLOCKS_ACTION,
    },
  })

  return {
    data: data?.data ?? [],
    error,
    isLoading,
    refetch,
  }
}

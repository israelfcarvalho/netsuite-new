'use client'

import { useSearchParams } from '@workspace/ui/lib/navigation'

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
  const queryParams = useSearchParams('string')

  const subsidiaryId = queryParams.get('subsidiaryId')

  const requestQueryParams: RanchBlockQueryParams = {
    script,
    deploy,
    parentId,
    action: GET_RANCH_BLOCKS_ACTION,
  }

  if (typeof subsidiaryId === 'string') {
    requestQueryParams['subsidiaryId'] = subsidiaryId
  }

  const { data, error, isLoading, refetch } = useListReportApiGet<RanchBlockApiResponse, RanchBlockQueryParams>(route, {
    queryParams: requestQueryParams,
  })

  return {
    data: data?.data ?? [],
    error,
    isLoading,
    refetch,
  }
}

'use client'

import { useApiGet } from '@workspace/core/api'

import { RanchBlockApiResponse, RanchBlockQueryParams } from './types'
import { environments } from '../../environments'

const {
  api: {
    ranchBlock: { deploy, script, route },
  },
} = environments

const GET_RANCH_BLOCKS_ACTION = 'by-hierarchy'

export function useGetRanchBlocks(parentId?: string) {
  const { data, error, isLoading, refetch } = useApiGet<RanchBlockApiResponse, RanchBlockQueryParams>(route, {
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

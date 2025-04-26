'use client'

import { useApiGet } from '@workspace/core/api'

import { CropPlanApiResponse, CropPlanLinesQueryParams, UseGetCropPlanLinesProps } from './types'
import { environments } from '../../environments'
const ACTION = 'get-lines-hierarchy'

const {
  api: {
    cropPlan: { deploy, script, route },
  },
} = environments

const initialData: CropPlanApiResponse['data'] = []

export function useGetCropPlanLines({ cropPlanId }: UseGetCropPlanLinesProps) {
  const { data, error, isLoading, refetch } = useApiGet<CropPlanApiResponse, CropPlanLinesQueryParams>(route, {
    queryOptions: { enabled: cropPlanId !== undefined },
    queryParams: {
      script,
      deploy,
      action: ACTION,
      cropPlanId: cropPlanId,
    },
  })

  return {
    data: data?.data ?? initialData,
    error,
    isLoading,
    refetch,
  }
}

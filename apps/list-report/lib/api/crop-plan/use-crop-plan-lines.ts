'use client'

import { useApiGet, useApiPost } from '@workspace/core/api'

import {
  CropPlanApiResponse,
  CropPlanLinesQueryParams,
  GetCropPlanLinesParams,
  UpdateCropPlanLinesParams,
  UpdateCropPlanLinesPayload,
} from './types'
import { environments } from '../../environments'
const ACTION = 'get-lines-hierarchy'
const UPDATE_ACTION = 'update-lines'

const {
  api: {
    cropPlan: { deploy, script, route },
  },
} = environments

const initialData: CropPlanApiResponse['data'] = []

export function useGetCropPlanLines({ cropPlanId }: GetCropPlanLinesParams) {
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

export function useSaveCropPlanLines() {
  const api = useApiPost<CropPlanApiResponse, UpdateCropPlanLinesPayload, UpdateCropPlanLinesParams>(route, {
    queryParams: {
      script,
      deploy,
    },
  })

  function updateLines(cropPlanId: number, lines: UpdateCropPlanLinesPayload['lines']) {
    api.post({
      action: UPDATE_ACTION,
      cropPlanId,
      lines,
    })
  }
  return {
    updateLines,
    data: api.data,
    error: api.error,
    isLoading: api.isPending,
  }
}

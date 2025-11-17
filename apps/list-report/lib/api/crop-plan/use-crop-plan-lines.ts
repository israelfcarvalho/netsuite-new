'use client'

import {
  CropPlanApiResponse,
  CropPlanLinesQueryParams,
  GetCropPlanLineHistoryParams,
  GetCropPlanLinesHistoryResponse,
  GetCropPlanLinesParams,
  UpdateCropPlanLinesParams,
  UpdateCropPlanLinesPayload,
} from './types'
import { environments } from '../../environments'

import { useListReportApiGet, useListReportApiPost } from '@/lib/api/_common'

const ACTION = 'get-lines-hierarchy'
const UPDATE_ACTION = 'update-lines'

const {
  api: { cropPlan },
} = environments

const initialData: CropPlanApiResponse['data'] = []

export function useGetCropPlanLines({ cropPlanId }: GetCropPlanLinesParams) {
  const { data, error, isLoading, refetch, isFetching } = useListReportApiGet<
    CropPlanApiResponse,
    CropPlanLinesQueryParams
  >(cropPlan.route, {
    queryOptions: { enabled: cropPlanId !== undefined, gcTime: 0 },
    queryParams: {
      script: cropPlan.script,
      deploy: cropPlan.deploy,
      action: ACTION,
      cropPlanId,
    },
  })

  return {
    cropPlanLines: data?.data ?? initialData,
    error,
    isLoading,
    refetch,
    isFetching,
  }
}

export function useGetCropPlanLinesHistory({ cropPlanId, costTypeId }: GetCropPlanLineHistoryParams) {
  const { data, error, isLoading, refetch, isFetching } = useListReportApiGet<
    GetCropPlanLinesHistoryResponse,
    GetCropPlanLineHistoryParams
  >(cropPlan.history.route, {
    queryOptions: { enabled: cropPlanId !== undefined, gcTime: 0 },
    queryParams: {
      script: cropPlan.history.script,
      deploy: cropPlan.history.deploy,
      cropPlanId,
      costTypeId,
    },
  })

  return {
    history: data?.history ?? [],
    error,
    isLoading,
    refetch,
    isFetching,
  }
}

export function useSaveCropPlanLines() {
  const api = useListReportApiPost<CropPlanApiResponse, UpdateCropPlanLinesPayload, UpdateCropPlanLinesParams>(
    cropPlan.route,
    {
      queryParams: {
        script: cropPlan.script,
        deploy: cropPlan.deploy,
      },
    }
  )

  function updateLines(
    cropPlanId: number,
    lines: UpdateCropPlanLinesPayload['lines'],
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }
  ) {
    api.post(
      {
        action: UPDATE_ACTION,
        cropPlanId,
        lines,
      },
      options
    )
  }

  return {
    updateLines,
    data: api.data,
    error: api.error,
    isPending: api.isPending,
  }
}

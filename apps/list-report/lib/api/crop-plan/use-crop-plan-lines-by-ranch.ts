import { useSearchParams } from '@workspace/ui/lib/navigation'

import {
  CropPlanApiResponse,
  CropPlanLinesQueryParams,
  GetCropPlanLinesParams,
  UpdateCropPlanLinesByRanchPayload,
  UpdateCropPlanLinesParams,
} from './types'
import { environments } from '../../environments'

import { useListReportApiGet, useListReportApiPost } from '@/lib/api/_common'

const ACTION = 'get-lines-by-ranch-id'
const UPDATE_ACTION = 'update-lines-by-ranch'

const {
  api: {
    cropPlan: { deploy, script, route },
  },
} = environments

const initialData: CropPlanApiResponse['data'] = []

export function useGetCropPlanLinesByRanch({ cropPlanId, block }: GetCropPlanLinesParams) {
  const queryParams = useSearchParams('string')

  const subsidiaryId = queryParams.get('subsidiaryId')

  const requestQueryParams: CropPlanLinesQueryParams = {
    script,
    deploy,
    block,
    action: ACTION,
    cropPlanId: cropPlanId,
  }

  if (typeof subsidiaryId === 'string') {
    requestQueryParams['subsidiaryId'] = subsidiaryId
  }

  const { data, error, isLoading, refetch, isFetching } = useListReportApiGet<
    CropPlanApiResponse,
    CropPlanLinesQueryParams
  >(route, {
    queryOptions: { enabled: cropPlanId !== undefined, gcTime: 0 },
    queryParams: requestQueryParams,
  })

  return {
    cropPlanLines: data?.data ?? initialData,
    error,
    isLoading,
    refetch,
    isFetching,
  }
}

export function useSaveCropPlanLinesByRanch() {
  const api = useListReportApiPost<CropPlanApiResponse, UpdateCropPlanLinesByRanchPayload, UpdateCropPlanLinesParams>(
    route,
    {
      queryParams: {
        script,
        deploy,
      },
    }
  )

  function updateLines(
    cropPlanId: number,
    lines: UpdateCropPlanLinesByRanchPayload['lines'],
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

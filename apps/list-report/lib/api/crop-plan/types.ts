import { QueryParams } from '@workspace/core/api/_common/types'

import { BudgetNode } from '@/lib/components/budget-table/use-budget-table/types'

export interface CropPlanLineItem
  extends Pick<
    BudgetNode,
    | 'originalEstimate'
    | 'originalEstimatePerAcre'
    | 'currentEstimate'
    | 'currentEstimatePerAcre'
    | 'projectedEstimate'
    | 'committedCost'
    | 'actualCost'
    | 'wipBalance'
    | 'totalAcres'
  > {
  id: string // Assuming ID is always a string, adjust if it can be a number
  name: string
  unitCost: number
  children?: CropPlanLineItem[] // Optional children for hierarchy
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLineItem[]
}

export interface CropPlanLinesQueryParams extends QueryParams {
  script: string
  deploy: string
  action: string
  cropPlanId?: number
}

export interface GetCropPlanLinesParams {
  cropPlanId?: number
  block?: string
}

export interface UpdateCropPlanLines
  extends Pick<
    CropPlanLineItem,
    'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
  > {
  divisionId: number
  costCodeId: number
  costTypeId: number
}

export interface UpdateCropPlanLinesPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLines[]
}

export interface UpdateCropPlanLinesParams extends QueryParams {
  script: string
  deploy: string
}

export interface UpdateCropPlanLinesByRanch extends UpdateCropPlanLines {
  ranchId: number
}

export interface UpdateCropPlanLinesByRanchPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLinesByRanch[]
}

import { QueryParams } from '@workspace/core/api/_common/types'

export interface CropPlanLineItem {
  id: string // Assuming ID is always a string, adjust if it can be a number
  name: string
  unitCost: number
  initialCost: number
  currentPlannedCost: number
  projectedCost: number
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
}

export interface UpdateCropPlanLinesPayload {
  action: string
  cropPlanId: number
  lines: {
    divisionId: number
    costCodeId: number
    costTypeId: number
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }[]
}

export interface UpdateCropPlanLinesParams extends QueryParams {
  script: string
  deploy: string
}

export interface UpdateCropPlanLinesByRanchPayload {
  action: string
  cropPlanId: number
  lines: {
    ranchId: number
    divisionId: number
    costCodeId: number
    costTypeId: number
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }[]
}

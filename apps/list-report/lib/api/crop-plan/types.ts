import { QueryParams } from '@workspace/core/api/_common/types'

export interface CropPlanLineItem {
  id: string // Assuming ID is always a string, adjust if it can be a number
  name: string
  unitCost: number
  originalEstimate: number
  currentEstimate: number
  projectedEstimate: number
  children?: CropPlanLineItem[] // Optional children for hierarchy
  committedCost: number
  actualCost: number
  notAllocatedCost?: number
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

export interface UpdateCropPlanLinesPayload {
  action: string
  cropPlanId: number
  lines: {
    divisionId: number
    costCodeId: number
    costTypeId: number
    originalEstimate: number
    currentEstimate: number
    projectedEstimate: number
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
    originalEstimate: number
    currentEstimate: number
    projectedEstimate: number
  }[]
}

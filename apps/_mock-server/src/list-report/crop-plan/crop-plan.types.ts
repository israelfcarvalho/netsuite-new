// Copy exact interfaces from list-report app
export interface CropPlanLineItem {
  id: string
  name: string
  unitCost: number
  originalEstimate: number
  originalEstimatePerAcre: number
  currentEstimate: number
  currentEstimatePerAcre: number
  projectedEstimate: number
  committedCost: number
  actualCost: number
  wipBalance?: number // Only present in by-block context
  children?: CropPlanLineItem[]
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLineItem[]
}

export interface CropPlanLinesQueryParams {
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
    originalEstimatePerAcre: number
    currentEstimate: number
    currentEstimatePerAcre: number
    projectedEstimate: number
  }[]
}

export interface UpdateCropPlanLinesParams {
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
    originalEstimatePerAcre: number
    currentEstimate: number
    currentEstimatePerAcre: number
    projectedEstimate: number
  }[]
}

// Alias for compatibility
export type CropPlanLine = CropPlanLineItem
export type CropPlanQueryParams = CropPlanLinesQueryParams

// Copy exact interfaces from list-report app
export interface CropPlanLine {
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
  totalAcres: number
  wipBalance?: number // Only present in by-block context
  children?: CropPlanLine[]
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLine[]
}

export interface CropPlanLinesQueryParams {
  script: string
  deploy: string
  action: string
  cropPlanId?: number
  block?: string
}

export interface GetCropPlanLinesParams {
  cropPlanId?: number
  block?: string
}

interface UpdateCropPlanLine
  extends Pick<
    CropPlanLine,
    'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
  > {
  divisionId: number
  costCodeId: number
  costTypeId: number
}

export interface UpdateCropPlanLinesPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLine[]
}

export interface UpdateCropPlanLinesParams {
  script: string
  deploy: string
}

interface UpdateCropPlanLinesByRanchLine extends UpdateCropPlanLine {
  ranchId: number
}

export interface UpdateCropPlanLinesByRanchPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLinesByRanchLine[]
}

// Alias for compatibility
export type CropPlanQueryParams = CropPlanLinesQueryParams

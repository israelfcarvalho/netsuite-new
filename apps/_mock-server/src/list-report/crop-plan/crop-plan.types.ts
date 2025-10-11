export interface CropPlanLine {
  id: string
  name: string
  originalEstimate: number
  originalEstimatePerAcre: number
  currentEstimate: number
  projectedEstimate: number
  committedCost: number
  actualCost: number
  children?: CropPlanLine[]
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLine[]
}

export interface CropPlanQueryParams {
  script: string
  deploy: string
  action: string
  cropPlanId?: number
}

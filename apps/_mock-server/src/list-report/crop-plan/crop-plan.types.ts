export interface CropPlanLine {
  id: string
  name: string
  unitCost: number
  originalEstimate: number
  currentEstimate: number
  projectedEstimate: number
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

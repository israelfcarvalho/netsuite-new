import { QueryParams } from '@workspace/core/api/_common/types'

export interface CropPlanLine {
  id: string // Assuming ID is always a string, adjust if it can be a number
  name: string
  unitCost: number
  initialCost: number
  currentPlannedCost: number
  projectedCost: number
  children?: CropPlanLine[] // Optional children for hierarchy
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLine[]
}

export interface CropPlanLinesQueryParams extends QueryParams {
  script: string
  deploy: string
  action: string
  cropPlanId?: number
}

export interface UseGetCropPlanLinesProps {
  cropPlanId?: number
}

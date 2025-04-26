import { QueryParams } from '@workspace/core/api'

export interface CostType {
  id: string
  name: string
  costCodeId?: string
}

export interface CostTypeApiResponse {
  status: number
  message: string
  data: CostType[]
}

export interface CostTypeQueryParams extends QueryParams {
  script: string
  deploy: string
  costCodeId: string
}

export interface UseGetCostTypesProps {
  costCodeId: string
}

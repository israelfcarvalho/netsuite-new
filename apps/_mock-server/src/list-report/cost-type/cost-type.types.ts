// Copy exact interfaces from list-report app
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

export interface CostTypeQueryParams {
  script: string
  deploy: string
  costCodeId?: string
}

export interface UseGetCostTypesProps {
  costCodeId?: string
}

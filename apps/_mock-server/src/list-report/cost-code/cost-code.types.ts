// Copy exact interfaces from list-report app
export interface CostCode {
  id: string
  name: string
  cost_code: string
}

export interface CostCodeApiResponse {
  status: number
  message: string
  data: CostCode[]
}

export interface CostCodeQueryParams {
  script: string
  deploy: string
  divisionId?: string
}

export interface UseGetCostCodesProps {
  divisionId?: string
}

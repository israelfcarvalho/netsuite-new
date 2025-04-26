export interface CostCode {
  id: string
  name: string
  cost_code: string
  costTypes?: string[]
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

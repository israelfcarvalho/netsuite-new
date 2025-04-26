export interface Division {
  id: string
  name: string
  costCodes?: string[]
}

export interface DivisionApiResponse {
  status: number
  message: string
  data: Division[]
}

export interface DivisionQueryParams {
  script: string
  deploy: string
}

import { QueryParams } from '@workspace/core/api'

export interface Division {
  id: string
  name: string
}

export interface DivisionApiResponse {
  status: number
  message: string
  data: Division[]
}

export interface DivisionQueryParams extends QueryParams {
  script: string
  deploy: string
}

import { QueryParams } from '@workspace/core/api'

export interface RanchBlockParent {
  id: string
  name: string
}

export interface RanchBlock {
  id: string
  name: string
  parent?: RanchBlockParent
  netsuiteLink: string
}

export interface RanchBlockApiResponse {
  status: number
  message: string
  data: RanchBlock[]
}

export interface RanchBlockQueryParams extends QueryParams {
  script: string
  deploy: string
  parentId?: string
}

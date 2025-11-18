import { QueryParams } from '@workspace/core/api/_common/types'

export interface CropPlanLineItem {
  id: string
  name: string
  totalAcres: number
  originalEstimate: number
  originalEstimatePerAcre: number
  currentEstimate: number
  currentEstimatePerAcre: number
  projectedEstimate: number
  committedCost: number
  actualCost: number
  wipBalance?: number // only used in by-block context
  wipInput?: number // only used in no-block context
  children?: CropPlanLineItem[]
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLineItem[]
}

export interface CropPlanLinesQueryParams extends QueryParams {
  script: string
  deploy: string
  action: string
  cropPlanId?: number
}

export interface GetCropPlanLinesParams {
  cropPlanId?: number
  block?: string
}

interface CropPlanLineHistoryItemData {
  previousValue: number
  currentValue: number
  comment?: string
  date: string
}

export interface GetCropPlanLineHistoryParams extends QueryParams {
  cropPlanId?: number
  lineId?: string
  enabled?: boolean
}

type CropPlanHistoryItemName = keyof Pick<
  CropPlanLineItem,
  'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
>

export interface CropPlanLineHistoryItem<T extends CropPlanHistoryItemName = CropPlanHistoryItemName> {
  id: string
  user: string
  name: T
  data: CropPlanLineHistoryItemData[]
}

export interface GetCropPlanLinesHistoryResponse {
  history: { [K in CropPlanHistoryItemName]?: CropPlanLineHistoryItem<K> }
}

export interface UpdateCropPlanLines
  extends Pick<
    CropPlanLineItem,
    'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
  > {
  divisionId: number
  costCodeId: number
  costTypeId: number
}

export interface UpdateCropPlanLinesPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLines[]
}

export interface UpdateCropPlanLinesParams extends QueryParams {
  script: string
  deploy: string
}

export interface UpdateCropPlanLinesByRanch extends UpdateCropPlanLines {
  ranchId: number
}

export interface UpdateCropPlanLinesByRanchPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLinesByRanch[]
}

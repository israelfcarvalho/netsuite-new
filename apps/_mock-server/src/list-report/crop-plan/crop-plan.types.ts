// Copy exact interfaces from list-report app
export interface CropPlanLine {
  id: string
  name: string
  unitCost: number
  originalEstimate: number
  originalEstimatePerAcre: number
  currentEstimate: number
  currentEstimatePerAcre: number
  projectedEstimate: number
  committedCost: number
  actualCost: number
  totalAcres: number
  wipBalance?: number // Only present in by-block context
  wipInput?: number // Only present in no-block context
  children?: CropPlanLine[]
}

export interface CropPlanApiResponse {
  status: number
  message: string
  data: CropPlanLine[]
}

export interface CropPlanLinesQueryParams {
  script: string
  deploy: string
  action: string
  cropPlanId?: number
  block?: string
}

export interface GetCropPlanLinesParams {
  cropPlanId?: number
  block?: string
}

interface UpdateCropPlanLine
  extends Pick<
    CropPlanLine,
    'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
  > {
  divisionId: number
  costCodeId: number
  costTypeId: number
}

export interface UpdateCropPlanLinesPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLine[]
}

export interface UpdateCropPlanLinesParams {
  script: string
  deploy: string
}

interface UpdateCropPlanLinesByRanchLine extends UpdateCropPlanLine {
  ranchId: number
}

export interface UpdateCropPlanLinesByRanchPayload {
  action: string
  cropPlanId: number
  lines: UpdateCropPlanLinesByRanchLine[]
}

// Alias for compatibility
export type CropPlanQueryParams = CropPlanLinesQueryParams

// History types
type CropPlanHistoryItemName = keyof Pick<
  CropPlanLine,
  'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
>

interface CropPlanLineHistoryItemData {
  previousValue: number
  currentValue: number
  comment?: string
  date: string
}

export interface CropPlanLineHistoryItem<T extends CropPlanHistoryItemName = CropPlanHistoryItemName> {
  id: string
  user: string
  name: T
  data: CropPlanLineHistoryItemData[]
}

export interface GetCropPlanLineHistoryParams {
  script: string
  deploy: string
  cropPlanId?: number
  lineId?: number
}

export interface GetCropPlanLinesHistoryResponse {
  history: { [K in CropPlanHistoryItemName]?: CropPlanLineHistoryItem<K> }
}

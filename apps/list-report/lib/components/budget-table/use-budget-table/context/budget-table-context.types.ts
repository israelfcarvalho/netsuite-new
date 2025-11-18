import { BudgetNode, BudgetState } from '../types'

import { CostCode, CostType, CropPlanLineItem, Division } from '@/lib/api'

export interface BudgetTableContextType {
  state: BudgetState
  updateNode: (rowId: string, updates: Partial<BudgetNode>) => void
  addNode: (
    division: Division,
    costCode: CostCode,
    costType: CostType,
    originalEstimate: number,
    originalEstimatePerAcre: number,
    currentEstimate: number,
    currentEstimatePerAcre: number,
    projectedEstimate: number
  ) => void
  deleteNode: (rowId: string) => void
  levels: number
}

export interface BudgetTableProviderProps {
  children: React.ReactNode
  cropPlanLines?: CropPlanLineItem[]
}

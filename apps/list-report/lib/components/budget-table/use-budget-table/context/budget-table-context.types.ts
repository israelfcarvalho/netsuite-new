import { UpdateHistoryAction } from '../reducer/actions'
import { BudgetNode, BudgetState } from '../types'

import { CropPlanLineItem } from '@/lib/api'

export interface BudgetTableContextType {
  state: BudgetState
  updateNode: (rowId: string, updates: Partial<BudgetNode>) => void
  deleteNode: (rowId: string) => void
  levels: number
  updateLocalHistory: (payload: UpdateHistoryAction['payload']) => void
  clearHistory: () => void
}

export interface BudgetTableProviderProps {
  children: React.ReactNode
  cropPlanLines?: CropPlanLineItem[]
}

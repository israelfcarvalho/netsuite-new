import { BudgetNode, BudgetState } from './use-budget-table/types'

import { Division } from '@/lib/api'
import { CostType } from '@/lib/api'
import { CostCode } from '@/lib/api'

interface OnBudgetTableAddNew {
  (node: {
    division: Division
    costCode: CostCode
    costType: CostType
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }): void
}

export interface BudgetTableProps {
  data: BudgetNode[]
  isLoading: boolean
  isSaving: boolean
  error?: string
  onAddNew?: OnBudgetTableAddNew
  onUpdate: (rowId: string, node: Partial<BudgetNode>) => void
  onDelete: (rowId: string) => void
  onSave: () => void
  state: BudgetState
}

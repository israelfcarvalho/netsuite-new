import { Dispatch, SetStateAction } from 'react'

import { BudgetNode, BudgetState } from './use-budget-table/types'

import { Division } from '@/lib/api'
import { CostType } from '@/lib/api'
import { CostCode } from '@/lib/api'
import { BlockFilter } from '@/lib/components/budget-table/budget-table-block-filters'

interface OnBudgetTableAddNew {
  (node: {
    division: Division
    costCode: CostCode
    costType: CostType
    originalEstimate: number
    currentEstimate: number
    projectedEstimate: number
  }): void
}

export interface BudgetTableProps {
  data: BudgetNode[]
  isLoading: boolean
  isSaving: boolean
  error?: string
  onAddNew?: OnBudgetTableAddNew
  onUpdate: (rowId: string, node: Partial<BudgetNode>) => void
  onDelete?: (rowId: string) => void
  onSave: () => void
  state: BudgetState
  levels: number
  hasBlockLevel?: boolean
  setBlockFilter?: Dispatch<SetStateAction<BlockFilter | undefined>>
  onRefresh: () => void
}

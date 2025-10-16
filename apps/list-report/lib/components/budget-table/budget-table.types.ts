import { Dispatch, SetStateAction } from 'react'

import { BudgetNode, BudgetState } from './use-budget-table/types'

import { Division } from '@/lib/api'
import { CostType } from '@/lib/api'
import { CostCode } from '@/lib/api'
import { BlockFilter } from '@/lib/components/budget-table/budget-table-block-filters'

interface AddNodePayload
  extends Pick<BudgetNode, 'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'projectedEstimate'> {
  division: Division
  costCode: CostCode
  costType: CostType
}

interface OnBudgetTableAddNew {
  (node: AddNodePayload): void
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
  filteredData: {
    data: BudgetNode[]
    divisionId: string
    costCodeId: string
    costTypeId: string
    setDivisionId: React.Dispatch<React.SetStateAction<string>>
    setCostCodeId: React.Dispatch<React.SetStateAction<string>>
    setCostTypeId: React.Dispatch<React.SetStateAction<string>>
    resetFilters: () => void
  }
}

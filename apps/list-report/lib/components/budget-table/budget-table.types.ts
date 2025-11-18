import { Dispatch, SetStateAction } from 'react'

import { BudgetNode } from './use-budget-table/types'

import { BlockFilter } from '@/lib/components/budget-table/budget-table-block-filters'

export interface BudgetTableProps {
  data: BudgetNode[]
  isLoading: boolean
  isSaving: boolean
  error?: string
  onSave: () => void
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

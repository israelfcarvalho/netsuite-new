import { BudgedHistoryDataName } from '../../budget-table/use-budget-table/types'

export interface BudgetHistoryModalProps {
  rowId: string
  onClose: () => void
  field: BudgedHistoryDataName
}

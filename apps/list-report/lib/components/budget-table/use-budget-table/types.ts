import { TData } from '@workspace/ui/components/table'

export interface BudgetNode extends TData {
  id: string
  rowId: string
  name: string
  initialCost: number
  currentPlannedCost: number
  projectedCost: number
  children?: BudgetNode[]
  parentRowId?: string
}

export interface BudgetState {
  nodes: Map<string, BudgetNode>
  tree: BudgetNode[]
}

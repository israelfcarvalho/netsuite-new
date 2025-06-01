import { TData } from '@workspace/ui/components/table'

export interface BudgetNode extends TData {
  id: string
  rowId: string
  name: string
  originalEstimate: number
  currentEstimate: number
  projectedEstimate: number
  committedCost: number
  actualCost: number
  notAllocatedCost?: number
  children?: BudgetNode[]
  parentRowId?: string
}

export interface BudgetState {
  nodes: Map<string, BudgetNode>
  tree: BudgetNode[]
}

export interface BudgetNodeCalculated extends BudgetNode {
  totalCost: number
  costsToComplete: number
  overUnder: number
  projCostComplete: number
}

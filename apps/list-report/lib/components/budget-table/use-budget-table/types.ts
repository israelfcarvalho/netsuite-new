import { TData } from '@workspace/ui/components/table'

export interface BudgetNode extends TData {
  id: string
  rowId: string
  name: string
  totalAcres: number
  originalEstimate: number
  originalEstimatePerAcre: number
  currentEstimate: number
  currentEstimatePerAcre: number
  projectedEstimate: number
  committedCost: number
  actualCost: number
  wipBalance?: number // only used in by-block context
  wipInput?: number // only used in no-block context
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

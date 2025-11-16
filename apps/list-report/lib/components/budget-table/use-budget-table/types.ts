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

type BudgetHitoryItem = keyof Pick<
  BudgetNode,
  'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
>

export interface BudgetHistoryDataState<T extends BudgetHitoryItem = BudgetHitoryItem> {
  rowId: string
  id: string
  name: T
  previousValue: number
  currentValue: number
  comment?: string
}

type LocalBudgetHistoryState = {
  [K in BudgetHitoryItem]?: BudgetHistoryDataState<K>
}

export interface RemoteBudgetHistoryDataState<T extends BudgetHitoryItem = BudgetHitoryItem>
  extends BudgetHistoryDataState<T> {
  date: string
  user: string
}

export type RemoteBudgetHistoryState = { [K in BudgetHitoryItem]?: RemoteBudgetHistoryDataState<K>[] }

export interface BudgetState {
  nodes: Map<string, BudgetNode>
  initialNodes: Map<string, BudgetNode>
  tree: BudgetNode[]
  history: {
    local?: LocalBudgetHistoryState
    remote?: RemoteBudgetHistoryState
  }
}

export interface BudgetNodeCalculated extends BudgetNode {
  totalCost: number
  costsToComplete: number
  overUnder: number
  projCostComplete: number
}

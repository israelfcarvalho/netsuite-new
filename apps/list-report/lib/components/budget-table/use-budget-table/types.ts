import { TData } from '@workspace/ui/components/table'

import { CropPlanLineItem, CropPlanLineHistoryItem } from '@/lib/api/crop-plan/types'

interface BudgetNode extends TData, Omit<CropPlanLineItem, 'children'> {
  children?: BudgetNode[]
}

type BudgedHistoryDataName = CropPlanLineHistoryItem['name']
type BudgetHistoryDataItem = Pick<CropPlanLineHistoryItem['data'][number], 'previousValue' | 'currentValue' | 'comment'>

export interface BudgetHistoryLocalDataState<T extends BudgedHistoryDataName = BudgedHistoryDataName>
  extends Omit<CropPlanLineHistoryItem, 'data'> {
  name: T
  data: BudgetHistoryDataItem[]
}

type BudgetHistoryLocalState = {
  [rowId in string]?: {
    [K in BudgedHistoryDataName]: BudgetHistoryLocalDataState<K>
  }
}

export interface BudgetHistoryRemoteDataState<T extends BudgedHistoryDataName = BudgedHistoryDataName>
  extends CropPlanLineHistoryItem {
  name: T
}

export type RemoteBudgetHistoryState = {
  [rowId in string]?: { [K in BudgedHistoryDataName]: BudgetHistoryRemoteDataState<K>[] }
}

export interface BudgetState {
  nodes: Map<string, BudgetNode>
  initialNodes: Map<string, BudgetNode>
  tree: BudgetNode[]
  history: {
    local?: BudgetHistoryLocalState
    remote?: RemoteBudgetHistoryState
  }
}

export interface BudgetNodeCalculated extends BudgetNode {
  totalCost: number
  costsToComplete: number
  overUnder: number
  projCostComplete: number
}

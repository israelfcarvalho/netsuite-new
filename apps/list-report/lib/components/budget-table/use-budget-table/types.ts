import { TData } from '@workspace/ui/components/table'

import { CropPlanLineItem, CropPlanLineHistoryItem } from '@/lib/api/crop-plan/types'

export interface BudgetNode extends TData, Omit<CropPlanLineItem, 'children'> {
  children?: BudgetNode[]
}

export type BudgedHistoryDataName = CropPlanLineHistoryItem['name']
type BudgetHistoryDataItem = Pick<CropPlanLineHistoryItem['data'][number], 'previousValue' | 'currentValue' | 'comment'>

export interface BudgetHistoryLocalDataState<T extends BudgedHistoryDataName>
  extends Omit<CropPlanLineHistoryItem, 'data' | 'user'> {
  name: T
  data: BudgetHistoryDataItem
}

type BudgetHistoryLocalState = {
  [rowId in string]?: {
    [K in BudgedHistoryDataName]?: BudgetHistoryLocalDataState<K>
  }
}

export interface BudgetHistoryRemoteDataState<T extends BudgedHistoryDataName = BudgedHistoryDataName>
  extends CropPlanLineHistoryItem {
  name: T
}

export type BudgetHistoryRemoteRowData = { [K in BudgedHistoryDataName]?: BudgetHistoryRemoteDataState<K> }

export type RemoteBudgetHistoryState = {
  [rowId in string]?: BudgetHistoryRemoteRowData
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
  totalCostPerAcre: number
  costsToComplete: number
  costsToCompletePerAcre: number
  overUnder: number
  projCostComplete: number
}

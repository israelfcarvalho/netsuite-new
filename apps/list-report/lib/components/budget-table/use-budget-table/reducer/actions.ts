import { BudgetNode } from '../types'

import { CostCode, CostType, CropPlanLineItem, Division } from '@/lib/api'

export type LoadNodesAction = {
  type: 'LOAD_NODES'
  payload: CropPlanLineItem[]
}

export type UpdateNodeAction = {
  type: 'UPDATE_NODE'
  payload: { rowId: string; updates: Partial<BudgetNode> }
}

export type AddNodeAction = {
  type: 'ADD_NODE'
  payload: {
    division: Division
    costCode: CostCode
    costType: CostType
    originalEstimate: number
    currentEstimate: number
    projectedEstimate: number
  }
}

export type DeleteNodeAction = {
  type: 'DELETE_NODE'
  payload: { rowId: string }
}

export type Action = LoadNodesAction | UpdateNodeAction | AddNodeAction | DeleteNodeAction

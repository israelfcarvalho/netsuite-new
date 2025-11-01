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

interface AddNodePayload
  extends Pick<
    BudgetNode,
    'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'currentEstimatePerAcre' | 'projectedEstimate'
  > {
  division: Division
  costCode: CostCode
  costType: CostType
}

export type AddNodeAction = {
  type: 'ADD_NODE'
  payload: AddNodePayload
}

export type DeleteNodeAction = {
  type: 'DELETE_NODE'
  payload: { rowId: string }
}

export type Action = LoadNodesAction | UpdateNodeAction | AddNodeAction | DeleteNodeAction

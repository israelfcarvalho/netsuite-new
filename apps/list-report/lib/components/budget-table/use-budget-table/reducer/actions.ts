import { BudgetHistoryDataState, BudgetNode, RemoteBudgetHistoryDataState } from '../types'

import { CostCode, CostType, CropPlanLineItem, Division } from '@/lib/api'

export enum ActionType {
  LOAD_NODES = 'use-budget-table/LOAD_NODES',
  UPDATE_NODE = 'use-budget-table/UPDATE_NODE',
  ADD_NODE = 'use-budget-table/ADD_NODE',
  DELETE_NODE = 'use-budget-table/DELETE_NODE',
  UPDATE_HISTORY = 'use-budget-table/UPDATE_HISTORY',
}

export interface UpdateLocalHistoryPayload extends BudgetHistoryDataState {
  type: 'local'
}

export interface UpdateRemoteHistoryPayload extends RemoteBudgetHistoryDataState {
  type: 'remote'
}

type UpdateHistoryPayload = UpdateLocalHistoryPayload | UpdateRemoteHistoryPayload

export type UpdateHistoryAction = {
  type: ActionType.UPDATE_HISTORY
  payload: UpdateHistoryPayload
}

export type LoadNodesAction = {
  type: ActionType.LOAD_NODES
  payload: CropPlanLineItem[]
}

export type UpdateNodeAction = {
  type: ActionType.UPDATE_NODE
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
  type: ActionType.ADD_NODE
  payload: AddNodePayload
}

export type DeleteNodeAction = {
  type: ActionType.DELETE_NODE
  payload: { rowId: string }
}

export type Action = LoadNodesAction | UpdateNodeAction | AddNodeAction | DeleteNodeAction | UpdateHistoryAction

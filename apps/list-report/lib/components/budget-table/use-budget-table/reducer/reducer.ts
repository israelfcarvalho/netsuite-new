'use client'

import { Action, ActionType } from './actions'
import { addNodeReducer } from './add-reducer'
import { deleteNodeReducer } from './delete-reducer'
import { loadNodesReducer } from './load-reducer'
import { updateNodeReducer } from './update-reducer'
import { BudgetState } from '../types'
import { updateHistoryReducer } from './history-reducer'

export function budgetTableReducer(state: BudgetState, action: Action): BudgetState {
  switch (action.type) {
    case ActionType.LOAD_NODES: {
      return loadNodesReducer(state, action)
    }

    case ActionType.UPDATE_NODE: {
      const newState = updateNodeReducer(state, action)
      return newState
    }

    case ActionType.ADD_NODE: {
      const newState = addNodeReducer(state, action)
      return newState
    }

    case ActionType.DELETE_NODE: {
      return deleteNodeReducer(state, action)
    }

    case ActionType.UPDATE_HISTORY: {
      return updateHistoryReducer(state, action)
    }

    default:
      return state
  }
}

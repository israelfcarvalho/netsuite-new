'use client'

import { Action } from './actions'
import { addNodeReducer } from './add-reducer'
import { deleteNodeReducer } from './delete-reducer'
import { loadNodesReducer } from './load-reducer'
import { updateNodeReducer } from './update-reducer'
import { CostState } from '../types'

export function costTableReducer(state: CostState, action: Action): CostState {
  switch (action.type) {
    case 'LOAD_NODES': {
      return loadNodesReducer(state, action)
    }

    case 'UPDATE_NODE': {
      const newState = updateNodeReducer(state, action)
      return newState
    }

    case 'ADD_NODE': {
      const newState = addNodeReducer(state, action)

      return newState
    }

    case 'DELETE_NODE': {
      return deleteNodeReducer(state, action)
    }

    default:
      return state
  }
}

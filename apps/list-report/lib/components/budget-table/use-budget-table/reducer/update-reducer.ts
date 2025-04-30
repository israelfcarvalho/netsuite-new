import { BudgetState } from '../types'
import { updateParents } from './__common/update-node-recursively'
import { UpdateNodeAction } from './actions'

export function updateNodeReducer(state: BudgetState, action: UpdateNodeAction): BudgetState {
  const { rowId, updates } = action.payload
  const node = state.nodes.get(rowId)

  if (!node) return state

  const updatedNode = {
    ...node,
    ...updates,
  }

  const newState = {
    ...state,
    nodes: new Map(state.nodes).set(rowId, updatedNode),
  }

  return updateParents(newState, updatedNode.parentRowId)
}

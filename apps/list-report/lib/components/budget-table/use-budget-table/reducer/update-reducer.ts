import { BudgetState } from '../types'
import { calculatePerAcreValues, PER_ACRE_FIELDS } from '../use-budget-table.utils'
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

  if (PER_ACRE_FIELDS.some((field) => !!updates[field])) {
    PER_ACRE_FIELDS.forEach((field) => {
      switch (field) {
        case 'originalEstimate':
          updatedNode.originalEstimatePerAcre = calculatePerAcreValues(
            updatedNode.originalEstimate,
            updatedNode.totalAcres
          )
          break
        case 'currentEstimate':
          updatedNode.currentEstimatePerAcre = calculatePerAcreValues(
            updatedNode.currentEstimate,
            updatedNode.totalAcres
          )
          break
        default:
          break
      }
    })
  }

  const newState = {
    ...state,
    nodes: new Map(state.nodes).set(rowId, updatedNode),
  }

  return updateParents(newState, updatedNode.parentRowId)
}

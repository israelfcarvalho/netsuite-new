import { mapCropPlanToNodes } from '../mapper/mapper'
import { BudgetState } from '../types'
import { LoadNodesAction } from './actions'

export function loadNodesReducer(state: BudgetState, action: LoadNodesAction): BudgetState {
  return {
    ...state,
    nodes: mapCropPlanToNodes(action.payload),
  }
}

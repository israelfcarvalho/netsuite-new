import { mapCropPlanToNodes } from '../mapper/mapper'
import { BudgetState } from '../types'
import { LoadNodesAction } from './actions'

export function loadNodesReducer(state: BudgetState, action: LoadNodesAction): BudgetState {
  const nodes = mapCropPlanToNodes(action.payload)

  return {
    ...state,
    nodes,
    initialNodes: nodes,
  }
}

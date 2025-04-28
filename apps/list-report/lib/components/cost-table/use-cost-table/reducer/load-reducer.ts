import { mapCropPlanToNodes } from '../mapper/mapper'
import { CostState } from '../types'
import { LoadNodesAction } from './actions'

export function loadNodesReducer(state: CostState, action: LoadNodesAction): CostState {
  return {
    ...state,
    nodes: mapCropPlanToNodes(action.payload),
  }
}

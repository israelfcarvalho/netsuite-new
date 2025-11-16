import { BudgetState } from '../types'
import { UpdateHistoryAction, UpdateLocalHistoryPayload, UpdateRemoteHistoryPayload } from './actions'

export function updateHistoryReducer(state: BudgetState, action: UpdateHistoryAction): BudgetState {
  return {
    ...state,
    history:
      action.payload.type === 'local'
        ? updateLocalHistory(state, action.payload)
        : updateRemoteHistory(state, action.payload),
  }
}

function updateLocalHistory(state: BudgetState, payload: UpdateLocalHistoryPayload): BudgetState['history'] {
  const selectedNode = state.initialNodes.get(payload.rowId)
  const oldValue = selectedNode?.[payload.name]
  const remove = oldValue === payload.currentValue

  return {
    ...state.history,
    local: {
      ...state.history.local,
      [payload.name]: remove ? undefined : payload,
    },
  }
}

function updateRemoteHistory(state: BudgetState, payload: UpdateRemoteHistoryPayload): BudgetState['history'] {
  return {
    ...state.history,
    remote: {
      ...state.history.remote,
      [payload.name]: payload,
    },
  }
}

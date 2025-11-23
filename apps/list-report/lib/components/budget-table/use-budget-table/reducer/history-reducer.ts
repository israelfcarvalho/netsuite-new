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
  const removeRowField = oldValue === payload.newValue
  let removeRow = false

  if (removeRowField) {
    removeRow = true
    Object.keys(state.history.local?.[payload.rowId] ?? {}).forEach((key) => {
      if (key !== payload.name) {
        removeRow = false
      }
    })
  }

  return {
    ...state.history,
    local: {
      ...state.history.local,
      [payload.rowId]: removeRow
        ? undefined
        : {
            ...state.history.local?.[payload.rowId],
            [payload.name]: removeRowField
              ? undefined
              : {
                  data: {
                    currentValue: payload.newValue,
                    previousValue: oldValue,
                    comment: payload.comment,
                  },
                  id: payload.lineId,
                  name: payload.name,
                },
          },
    },
  }
}

function updateRemoteHistory(state: BudgetState, payload: UpdateRemoteHistoryPayload): BudgetState['history'] {
  return {
    ...state.history,
    remote: {
      ...state.history.remote,
      [payload.rowId]: payload.data,
    },
  }
}

export function clearHistoryReducer(state: BudgetState): BudgetState {
  return {
    ...state,
    history: {
      ...state.history,
      local: undefined,
      remote: undefined,
    },
  }
}

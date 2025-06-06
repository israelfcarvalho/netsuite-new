import { BudgetState, BudgetNode } from '../types'
import { updateParents } from './__common/update-node-recursively'
import { DeleteNodeAction } from './actions'

function deleteFromParent(state: BudgetState, node: BudgetNode): BudgetState {
  const parentNode = state.nodes.get(node.parentRowId ?? '')
  if (!parentNode) return state

  parentNode.children = parentNode.children?.filter((child) => child.rowId !== node.rowId)
  const newNodes = new Map(state.nodes)

  if (parentNode.children?.length === 0) {
    newNodes.delete(parentNode.rowId)

    return deleteFromParent({ ...state, nodes: newNodes }, parentNode)
  }

  return updateParents({ ...state, nodes: newNodes }, node.parentRowId)
}

export function deleteNodeReducer(state: BudgetState, action: DeleteNodeAction): BudgetState {
  const { rowId } = action.payload
  const node = state.nodes.get(rowId)

  if (!node) return state

  const newNodes = new Map(state.nodes)
  newNodes.delete(rowId)

  return deleteFromParent({ ...state, nodes: newNodes }, node)
}

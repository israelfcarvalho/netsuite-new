import { BudgetState } from '../../types'

export function updateParents(state: BudgetState, parentRowId?: string): BudgetState {
  if (!parentRowId) return state

  const node = state.nodes.get(parentRowId)
  if (!node) return state

  const children =
    node.children?.map((child) => state.nodes.get(child.rowId)).filter((child) => child !== undefined) ?? []

  const { initialCost, currentPlannedCost, projectedCost } = children.reduce(
    (acc, child) => {
      return {
        initialCost: acc.initialCost + child.initialCost,
        currentPlannedCost: acc.currentPlannedCost + child.currentPlannedCost,
        projectedCost: acc.projectedCost + child.projectedCost,
      }
    },
    { initialCost: 0, currentPlannedCost: 0, projectedCost: 0 }
  )

  // Update the current node's values based on its children
  const updatedNode = {
    ...node,
    initialCost,
    currentPlannedCost,
    projectedCost,
    children,
  }

  // Create new state with updated node
  const newState = {
    ...state,
    nodes: new Map(state.nodes).set(node.rowId, updatedNode),
  }

  // If this node has a parent, recursively update it
  if (node.parentRowId) {
    return updateParents(newState, node.parentRowId)
  }

  return newState
}

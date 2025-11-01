import { BudgetNode, BudgetState } from '../../types'

export function updateParents(state: BudgetState, parentRowId?: string): BudgetState {
  if (!parentRowId) return state

  const node = state.nodes.get(parentRowId)
  if (!node) return state

  const children =
    node.children?.map((child) => state.nodes.get(child.rowId)).filter((child) => child !== undefined) ?? []

  const {
    originalEstimate,
    originalEstimatePerAcre,
    currentEstimate,
    currentEstimatePerAcre,
    projectedEstimate,
    committedCost,
    actualCost,
  } = children.reduce(
    (acc, child) => ({
      originalEstimate: acc.originalEstimate + child.originalEstimate,
      originalEstimatePerAcre: acc.originalEstimatePerAcre + child.originalEstimatePerAcre,
      currentEstimate: acc.currentEstimate + child.currentEstimate,
      currentEstimatePerAcre: acc.currentEstimatePerAcre + child.currentEstimatePerAcre,
      projectedEstimate: acc.projectedEstimate + child.projectedEstimate,
      committedCost: acc.committedCost + child.committedCost,
      actualCost: acc.actualCost + child.actualCost,
    }),
    {
      originalEstimate: 0,
      originalEstimatePerAcre: 0,
      currentEstimate: 0,
      currentEstimatePerAcre: 0,
      projectedEstimate: 0,
      committedCost: 0,
      actualCost: 0,
    } as Pick<
      BudgetNode,
      | 'originalEstimate'
      | 'originalEstimatePerAcre'
      | 'currentEstimate'
      | 'currentEstimatePerAcre'
      | 'projectedEstimate'
      | 'committedCost'
      | 'actualCost'
    >
  )

  // Update the current node's values based on its children
  const updatedNode: BudgetNode = {
    ...node,
    originalEstimate,
    originalEstimatePerAcre,
    currentEstimate,
    currentEstimatePerAcre,
    projectedEstimate,
    committedCost,
    actualCost,
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

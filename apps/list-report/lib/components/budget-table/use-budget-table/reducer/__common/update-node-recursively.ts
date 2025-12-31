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
    committedCostPerAcre,
    actualCost,
    actualCostPerAcre,
  } = children.reduce(
    (acc, child) => ({
      originalEstimate: acc.originalEstimate + child.originalEstimate,
      originalEstimatePerAcre: acc.originalEstimatePerAcre + child.originalEstimatePerAcre,
      currentEstimate: acc.currentEstimate + child.currentEstimate,
      currentEstimatePerAcre: acc.currentEstimatePerAcre + child.currentEstimatePerAcre,
      projectedEstimate: acc.projectedEstimate + child.projectedEstimate,
      committedCostPerAcre: acc.committedCostPerAcre + child.committedCostPerAcre,
      committedCost: acc.committedCost + child.committedCost,
      actualCost: acc.actualCost + child.actualCost,
      actualCostPerAcre: acc.actualCostPerAcre + child.actualCostPerAcre,
    }),
    {
      originalEstimate: 0,
      originalEstimatePerAcre: 0,
      currentEstimate: 0,
      currentEstimatePerAcre: 0,
      projectedEstimate: 0,
      projectedEstimatePerAcre: 0,
      committedCost: 0,
      committedCostPerAcre: 0,
      actualCost: 0,
      actualCostPerAcre: 0,
    } as Pick<
      BudgetNode,
      | 'originalEstimate'
      | 'originalEstimatePerAcre'
      | 'currentEstimate'
      | 'currentEstimatePerAcre'
      | 'projectedEstimate'
      | 'committedCostPerAcre'
      | 'committedCost'
      | 'actualCostPerAcre'
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
    committedCostPerAcre,
    actualCost,
    actualCostPerAcre,
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

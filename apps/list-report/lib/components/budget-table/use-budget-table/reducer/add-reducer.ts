import { AddNodeAction } from './actions'
import { BudgetState } from '../types'
import { BudgetNode } from '../types'
import { updateParents } from './__common/update-node-recursively'

const createNode = (
  data: Pick<
    BudgetNode,
    | 'id'
    | 'name'
    | 'parentRowId'
    | 'originalEstimate'
    | 'currentEstimate'
    | 'projectedEstimate'
    | 'originalEstimatePerAcre'
  >,
  parentRowId: string = ''
): BudgetNode => {
  const rowId = parentRowId.concat(data.id)
  return {
    ...data,
    rowId,
    parentRowId,
    committedCost: 0,
    actualCost: 0,
    notAllocatedCost: 0,
  }
}

export function addNodeReducer(state: BudgetState, action: AddNodeAction): BudgetState {
  const {
    division,
    costCode,
    costType,
    originalEstimate,
    currentEstimate,
    projectedEstimate,
    originalEstimatePerAcre,
  } = action.payload
  const newNodes = new Map(state.nodes)

  const divisionRowId = division.id.toString()
  const costCodeRowId = divisionRowId.concat(costCode.id.toString())
  const costTypeRowId = costCodeRowId.concat(costType.id.toString())

  let divisionNode = state.nodes.get(divisionRowId)
  let costCodeNode = state.nodes.get(costCodeRowId)
  let costTypeNode = state.nodes.get(costTypeRowId)
  const partialNode: Pick<
    BudgetNode,
    'originalEstimate' | 'currentEstimate' | 'projectedEstimate' | 'originalEstimatePerAcre'
  > = {
    originalEstimate,
    currentEstimate,
    projectedEstimate,
    originalEstimatePerAcre,
  }

  if (!divisionNode) {
    divisionNode = createNode({ id: division.id, name: division.name, ...partialNode })

    costCodeNode = createNode({ id: costCode.id, name: costCode.name, ...partialNode }, divisionNode.rowId)

    costTypeNode = createNode({ id: costType.id, name: costType.name, ...partialNode }, costCodeNode.rowId)

    newNodes.set(costTypeNode.rowId, costTypeNode)

    newNodes.set(divisionNode.rowId, {
      ...divisionNode,
      children: [costCodeNode],
    })

    newNodes.set(costCodeNode.rowId, {
      ...costCodeNode,
      children: [costTypeNode],
    })
  }

  if (!costCodeNode) {
    costCodeNode = createNode({ id: costCode.id, name: costCode.name, ...partialNode }, divisionNode.rowId)

    costTypeNode = createNode({ id: costType.id, name: costType.name, ...partialNode }, costCodeNode.rowId)

    newNodes.set(divisionNode.rowId, {
      ...divisionNode,
      children: [...(divisionNode.children ?? []), costCodeNode],
    })
    newNodes.set(costCodeNode.rowId, {
      ...costCodeNode,
      children: [costTypeNode],
    })
    newNodes.set(costTypeNode.rowId, costTypeNode)
  }

  if (!costTypeNode) {
    costTypeNode = createNode({ id: costType.id, name: costType.name, ...partialNode }, costCodeNode.rowId)

    newNodes.set(costCodeNode.rowId, {
      ...costCodeNode,
      children: [...(costCodeNode.children ?? []), costTypeNode],
    })
    newNodes.set(costTypeNode.rowId, costTypeNode)
  }

  return updateParents({ ...state, nodes: newNodes }, costTypeNode.parentRowId)
}

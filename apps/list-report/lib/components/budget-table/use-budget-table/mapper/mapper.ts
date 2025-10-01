import { BudgetNode, BudgetState } from '../types'

import { CropPlanLineItem } from '@/lib/api/crop-plan/types'

export function createNode(item: CropPlanLineItem, parentRowId: string = ''): BudgetNode {
  const rowId = parentRowId.concat(item.id)

  return {
    id: item.id,
    rowId,
    name: item.name,
    originalEstimate: item.originalEstimate,
    originalEstimatePerAcre: item.originalEstimatePerAcre,
    currentEstimate: item.currentEstimate,
    projectedEstimate: item.projectedEstimate,
    committedCost: item.committedCost,
    actualCost: item.actualCost,
    notAllocatedCost: item.notAllocatedCost,
    parentRowId,
  }
}

export function mapCropPlanToNodes(data: CropPlanLineItem[]): Map<string, BudgetNode> {
  const nodes = new Map<string, BudgetNode>()

  function processNode(item: CropPlanLineItem, parentRowId?: string) {
    const node = createNode(item, parentRowId)

    node.children = item.children?.map((child) => processNode(child, node.rowId))
    nodes.set(node.rowId, node)

    return node
  }

  data.forEach((item) => processNode(item))
  return nodes
}

export function buildInitialState(data: CropPlanLineItem[]): BudgetState {
  const nodes = mapCropPlanToNodes(data)

  return {
    nodes,
    tree: Array.from(nodes.values()).filter((node) => !node.parentRowId),
  }
}

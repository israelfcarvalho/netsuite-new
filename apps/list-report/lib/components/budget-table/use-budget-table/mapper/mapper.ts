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

    if (node.children?.length && node.children.length > 0) {
      node.originalEstimate = 0
      node.originalEstimatePerAcre = 0
      node.currentEstimate = 0
      node.projectedEstimate = 0
      node.committedCost = 0
      node.actualCost = 0

      if (node.notAllocatedCost !== undefined) {
        node.notAllocatedCost = 0
      }
    }

    node.children?.forEach((child) => {
      node.originalEstimate += child.originalEstimate
      node.originalEstimatePerAcre += child.originalEstimatePerAcre
      node.currentEstimate += child.currentEstimate
      node.projectedEstimate += child.projectedEstimate
      node.committedCost += child.committedCost
      node.actualCost += child.actualCost

      if (child.notAllocatedCost !== undefined && node.notAllocatedCost !== undefined) {
        node.notAllocatedCost += child.notAllocatedCost
      }
    })

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

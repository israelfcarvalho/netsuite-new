import { CostNode, CostState } from '../types'

import { CropPlanLineItem } from '@/lib/api/crop-plan/types'

export function createNode(item: CropPlanLineItem, parentRowId: string = ''): CostNode {
  const rowId = parentRowId.concat(item.id)

  return {
    id: item.id,
    rowId,
    name: item.name,
    initialCost: item.initialCost,
    currentPlannedCost: item.currentPlannedCost,
    projectedCost: item.projectedCost,
    parentRowId,
  }
}

export function mapCropPlanToNodes(data: CropPlanLineItem[]): Map<string, CostNode> {
  const nodes = new Map<string, CostNode>()

  function processNode(item: CropPlanLineItem, parentRowId?: string) {
    const node = createNode(item, parentRowId)

    node.children = item.children?.map((child) => processNode(child, node.rowId))
    nodes.set(node.rowId, node)

    return node
  }

  data.forEach((item) => processNode(item))
  return nodes
}

export function buildInitialState(data: CropPlanLineItem[]): CostState {
  const nodes = mapCropPlanToNodes(data)

  return {
    nodes,
    tree: Array.from(nodes.values()).filter((node) => !node.parentRowId),
  }
}

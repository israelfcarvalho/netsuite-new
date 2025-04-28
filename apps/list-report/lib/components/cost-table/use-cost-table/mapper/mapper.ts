import { CostNode, CostState } from '../types'

import { CropPlanLine } from '@/lib/api/crop-plan/types'

export function createNode(item: CropPlanLine, parentRowId: string = ''): CostNode {
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

export function mapCropPlanToNodes(data: CropPlanLine[]): Map<string, CostNode> {
  const nodes = new Map<string, CostNode>()

  function processNode(item: CropPlanLine, parentRowId?: string) {
    const node = createNode(item, parentRowId)

    node.children = item.children?.map((child) => processNode(child, node.rowId))
    nodes.set(node.rowId, node)

    return node
  }

  data.forEach((item) => processNode(item))
  return nodes
}

export function buildInitialState(data: CropPlanLine[]): CostState {
  const nodes = mapCropPlanToNodes(data)

  return {
    nodes,
  }
}

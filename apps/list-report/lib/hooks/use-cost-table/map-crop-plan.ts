import { CostNode } from './types'

import { CropPlanApiResponse } from '@/lib/api/crop-plan/types'

function calculateNodeValues(node: CostNode): void {
  if (node.children && node.children.length > 0) {
    node.initialCost = node.children.reduce((sum, child) => sum + child.initialCost, 0)
    node.currentPlannedCost = node.children.reduce((sum, child) => sum + child.currentPlannedCost, 0)
    node.projectedCost = node.children.reduce((sum, child) => sum + child.projectedCost, 0)
  }
}

function addParentAndPath(node: CropPlanApiResponse['data'][number], parentRowId?: string): CostNode {
  const rowId = (parentRowId ?? '').concat(node.id)

  const costNode: CostNode = {
    ...node,
    rowId,
    parentRowId,
    children: node.children?.map((child) => addParentAndPath(child, rowId)),
  }

  return costNode
}

export function mapCropPlan(data: CropPlanApiResponse['data']): CostNode[] {
  return data.map((node) => {
    // First add parentId and path
    const costNode = addParentAndPath(node)

    // Then calculate values from bottom up
    function processNode(node: CostNode): void {
      if (node.children) {
        node.children.forEach(processNode)
        calculateNodeValues(node)
      }
    }

    processNode(costNode)

    return costNode
  })
}

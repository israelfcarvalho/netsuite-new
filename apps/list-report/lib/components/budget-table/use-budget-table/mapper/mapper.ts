import { BudgetNode } from '../types'
import { calculatePerAcreValues } from '../use-budget-table.utils'

import { CropPlanLineItem } from '@/lib/api/crop-plan/types'

export function createNode(item: CropPlanLineItem, parentRowId: string = ''): BudgetNode {
  const rowId = parentRowId.concat(item.id)

  return {
    id: item.id,
    lineId: item.lineId,
    rowId,
    name: item.name,
    originalEstimate: item.originalEstimate,
    originalEstimatePerAcre: item.originalEstimate / item.totalAcres,
    currentEstimate: item.currentEstimate,
    currentEstimatePerAcre: item.currentEstimate / item.totalAcres,
    projectedEstimate: item.projectedEstimate,
    committedCost: item.committedCost,
    committedCostPerAcre: item.committedCost / item.totalAcres,
    actualCost: item.actualCost,
    actualCostPerAcre: item.actualCost / item.totalAcres,
    wipBalance: item.wipBalance,
    wipInput: item.wipInput,
    totalAcres: item.totalAcres,
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
      node.currentEstimate = 0
      node.projectedEstimate = 0
      node.committedCost = 0
      node.actualCost = 0
      node.actualCostPerAcre = 0
      node.committedCostPerAcre = 0
      node.currentEstimatePerAcre = 0
      node.originalEstimatePerAcre = 0
    }

    node.children?.forEach((child) => {
      node.originalEstimate += child.originalEstimate
      node.currentEstimate += child.currentEstimate
      node.projectedEstimate += child.projectedEstimate
      node.committedCost += child.committedCost
      node.actualCost += child.actualCost
      if (node.wipBalance) {
        node.wipBalance += child.wipBalance ?? 0
      }
      if (node.wipInput) {
        node.wipInput += child.wipInput ?? 0
      }
    })

    node.originalEstimatePerAcre = calculatePerAcreValues(node.originalEstimate, node.totalAcres)
    node.currentEstimatePerAcre = calculatePerAcreValues(node.currentEstimate, node.totalAcres)
    node.committedCostPerAcre = calculatePerAcreValues(node.committedCost, node.totalAcres)
    node.actualCostPerAcre = calculatePerAcreValues(node.actualCost, node.totalAcres)

    nodes.set(node.rowId, node)

    return node
  }

  data.forEach((item) => processNode(item))
  return nodes
}

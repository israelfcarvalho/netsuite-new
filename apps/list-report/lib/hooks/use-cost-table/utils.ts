import { CostNode } from './types'

export function buildTree(nodes: Record<string, CostNode>): CostNode[] {
  const rootNodes: CostNode[] = []
  const nodeMap = new Map<string, CostNode>()

  // First pass: create all nodes, adding children array only if needed
  Object.values(nodes).forEach((node) => {
    const newNode: CostNode = { ...node }

    if (node.children !== undefined) {
      newNode.children = []
    }

    nodeMap.set(node.rowId, newNode)
  })

  // Second pass: build the tree structure
  Object.values(nodes).forEach((node) => {
    const treeNode = nodeMap.get(node.rowId)!
    if (!node.parentRowId) {
      rootNodes.push(treeNode)
    } else {
      const parent = nodeMap.get(node.parentRowId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(treeNode)
      }
    }
  })

  return rootNodes
}

export function calculateGrandTotal(nodes: Record<string, CostNode>): CostNode {
  const grandTotalNode: CostNode = {
    id: 'grand-total',
    rowId: 'grand-total',
    parentRowId: '',
    name: 'Grand Total',
    initialCost: Object.values(nodes).reduce((sum, node) => {
      // Only sum values from leaf nodes (nodes without children)
      if (!node.children?.length && node.id !== 'grand-total') {
        return sum + node.initialCost
      }
      return sum
    }, 0),
    currentPlannedCost: Object.values(nodes).reduce((sum, node) => {
      if (!node.children?.length && node.id !== 'grand-total') {
        return sum + node.currentPlannedCost
      }
      return sum
    }, 0),
    projectedCost: Object.values(nodes).reduce((sum, node) => {
      if (!node.children?.length && node.id !== 'grand-total') {
        return sum + node.projectedCost
      }
      return sum
    }, 0),
  }

  return grandTotalNode
}

export function flattenTree(nodes: CostNode[]): Record<string, CostNode> {
  return nodes.reduce<Record<string, CostNode>>((acc, node) => {
    const flattenNode = (node: CostNode): void => {
      acc[node.rowId] = {
        ...node,
      }

      if (node.children) {
        node.children.forEach((child) => flattenNode(child))
      }
    }

    flattenNode(node)
    return acc
  }, {})
}

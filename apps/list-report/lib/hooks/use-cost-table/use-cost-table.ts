'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'

import { mapCropPlan } from './map-crop-plan'
import { CostNode, CostState, UseCostTableReturn } from './types'
import { buildTree, calculateGrandTotal, flattenTree } from './utils'

import { useGetCropPlanLines } from '@/lib/api'

export function useCostTable(): UseCostTableReturn {
  const queryParams = useSearchParams()
  const cropPlanId = queryParams.get('cropPlanId')

  const { data: initialData, isLoading, error } = useGetCropPlanLines({ cropPlanId: Number(cropPlanId) })
  const mappedData = mapCropPlan(initialData)
  const initialNodes = flattenTree(mappedData)

  // Calculate initial grand total values
  const grandTotalNode = calculateGrandTotal(initialNodes)

  const [state, setState] = useState<CostState>({
    nodes: { [grandTotalNode.id]: grandTotalNode, ...initialNodes },
    tree: [grandTotalNode, ...mappedData],
  })

  useEffect(() => {
    if (initialData) {
      const newMappedData = mapCropPlan(initialData)
      const newInitialNodes = flattenTree(newMappedData)
      const newGrandTotalNode = calculateGrandTotal(newInitialNodes)

      setState({
        nodes: { [newGrandTotalNode.id]: newGrandTotalNode, ...newInitialNodes },
        tree: [newGrandTotalNode, ...newMappedData],
      })
    }
  }, [initialData])

  const updateNode = useCallback((_node: CostNode, updates: Partial<CostNode>) => {
    setState((prev) => {
      const newNodes = { ...prev.nodes }

      function addNode(node: CostNode) {
        newNodes[node.rowId] = node
        if (node.children) {
          node.children.forEach((child) => {
            const childNode = newNodes[child.rowId]
            if (!childNode) {
              addNode(child)
            }
          })
        }
      }

      const divisionNode = _node
      const division = newNodes[divisionNode.rowId]
      if (!division) {
        addNode(divisionNode)
      }
      const costCodeNode = divisionNode?.children?.[0]
      const costCode = newNodes[costCodeNode?.rowId ?? '']
      if (costCodeNode && !costCode) {
        addNode(costCodeNode)
      }

      const costTypeNode = costCodeNode?.children?.[0]
      const costType = newNodes[costTypeNode?.rowId ?? '']
      if (costTypeNode && !costType) {
        addNode(costTypeNode)
      }

      console.log({ division, costCode, costType })

      const node = newNodes[_node.rowId]

      if (!node) return prev

      // Update the node
      newNodes[_node.rowId] = { ...node, ...updates }

      // Update affected parents
      let currentPath = _node.parentRowId

      let tries = 0

      while (currentPath) {
        const parent = newNodes[currentPath]

        console.log({ currentPath, parent, newNodes, prev })

        if (!parent) break

        const children = Object.values(newNodes).filter((n) => n.parentRowId === currentPath)

        // Recalculate parent values from its children
        parent.initialCost = children.reduce((sum, child) => sum + child.initialCost, 0)
        parent.currentPlannedCost = children.reduce((sum, child) => sum + child.currentPlannedCost, 0)
        parent.projectedCost = children.reduce((sum, child) => sum + child.projectedCost, 0)

        currentPath = parent.parentRowId
        tries++
        if (tries > 10) break
      }

      const grandTotalNode = calculateGrandTotal(newNodes)
      const newTree = buildTree(newNodes)

      return {
        nodes: { [grandTotalNode.id]: grandTotalNode, ...newNodes },
        tree: [grandTotalNode, ...newTree.filter((node) => node.id !== 'grand-total')],
      }
    })
  }, [])

  return {
    data: state.tree,
    updateNode,
    isLoading,
    error: error?.message,
    state,
  }
}

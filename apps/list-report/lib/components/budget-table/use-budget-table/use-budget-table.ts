'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useReducer, useCallback, useMemo } from 'react'

import { budgetTableReducer } from './reducer/reducer'
import { BudgetNode } from './types'

import { useGetCropPlanLines } from '@/lib/api'
import { Division, CostCode, CostType } from '@/lib/api'

export function useBudgetTable() {
  const queryParams = useSearchParams()
  const cropPlanId = queryParams.get('cropPlanId')

  const { data: initialData, isLoading, error } = useGetCropPlanLines({ cropPlanId: Number(cropPlanId) })

  const [state, dispatch] = useReducer(budgetTableReducer, {
    nodes: new Map<string, BudgetNode>(),
    tree: [],
  })

  useEffect(() => {
    if (initialData) {
      dispatch({ type: 'LOAD_NODES', payload: initialData })
    }
  }, [initialData])

  const updateNode = useCallback((rowId: string, updates: Partial<BudgetNode>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { rowId, updates } })
  }, [])

  const addNode = useCallback(
    (
      division: Division,
      costCode: CostCode,
      costType: CostType,
      initialCost: number,
      currentPlannedCost: number,
      projectedCost: number
    ) => {
      dispatch({
        type: 'ADD_NODE',
        payload: { division, costCode, costType, initialCost, currentPlannedCost, projectedCost },
      })
    },
    []
  )

  const deleteNode = useCallback((rowId: string) => {
    dispatch({ type: 'DELETE_NODE', payload: { rowId } })
  }, [])

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    // Calculate grand total
    const grandTotal = nodes.reduce(
      (acc, node) => ({
        initialCost: acc.initialCost + node.initialCost,
        currentPlannedCost: acc.currentPlannedCost + node.currentPlannedCost,
        projectedCost: acc.projectedCost + node.projectedCost,
      }),
      { initialCost: 0, currentPlannedCost: 0, projectedCost: 0 }
    )

    // Add grand total row
    const grandTotalNode: BudgetNode = {
      id: 'grand-total',
      rowId: 'grand-total',
      name: 'Grand Total',
      ...grandTotal,
    }

    return [grandTotalNode, ...nodes]
  }, [state.nodes])

  return {
    data,
    updateNode,
    addNode,
    deleteNode,
    isLoading,
    error: error?.message,
    state,
  }
}

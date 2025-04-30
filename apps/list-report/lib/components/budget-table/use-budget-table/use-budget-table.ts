'use client'

import { useEffect, useReducer, useCallback } from 'react'

import { budgetTableReducer } from './reducer/reducer'
import { BudgetNode } from './types'

import { CropPlanLineItem } from '@/lib/api'
import { Division, CostCode, CostType } from '@/lib/api'

export function useBudgetTable({ cropPlanLines }: { cropPlanLines: CropPlanLineItem[] }) {
  const [state, dispatch] = useReducer(budgetTableReducer, {
    nodes: new Map<string, BudgetNode>(),
    tree: [],
  })

  useEffect(() => {
    if (cropPlanLines) {
      dispatch({ type: 'LOAD_NODES', payload: cropPlanLines })
    }
  }, [cropPlanLines])

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

  return {
    updateNode,
    addNode,
    deleteNode,
    state,
  }
}

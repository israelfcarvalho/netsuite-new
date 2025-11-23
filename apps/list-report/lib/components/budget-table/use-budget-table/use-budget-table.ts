'use client'

import { useEffect, useReducer, useCallback, useMemo } from 'react'

import { ActionType, UpdateHistoryAction } from './reducer/actions'
import { budgetTableReducer } from './reducer/reducer'
import { BudgetNode } from './types'

import { CropPlanLineItem } from '@/lib/api'
import { Division, CostCode, CostType } from '@/lib/api'

export function useBudgetTable({ cropPlanLines }: { cropPlanLines: CropPlanLineItem[] }) {
  const [state, dispatch] = useReducer(budgetTableReducer, {
    nodes: new Map<string, BudgetNode>(),
    initialNodes: new Map<string, BudgetNode>(),
    tree: [],
    history: {},
  })

  useEffect(() => {
    if (cropPlanLines) {
      dispatch({ type: ActionType.LOAD_NODES, payload: cropPlanLines })
    }
  }, [cropPlanLines])

  const levels = useMemo(() => {
    type Children = { children?: Children[] }

    function getLevels(children?: Children[], level = 0): number {
      if (!children?.length) return level

      return children.reduce((_, child) => {
        return getLevels(child.children, level + 1)
      }, level)
    }

    return getLevels(cropPlanLines)
  }, [cropPlanLines])

  const updateNode = useCallback((rowId: string, updates: Partial<BudgetNode>) => {
    dispatch({ type: ActionType.UPDATE_NODE, payload: { rowId, updates } })
  }, [])

  const addNode = useCallback(
    (
      division: Division,
      costCode: CostCode,
      costType: CostType,
      originalEstimate: number,
      originalEstimatePerAcre: number,
      currentEstimate: number,
      currentEstimatePerAcre: number,
      projectedEstimate: number
    ) => {
      dispatch({
        type: ActionType.ADD_NODE,
        payload: {
          division,
          costCode,
          costType,
          originalEstimate,
          originalEstimatePerAcre,
          currentEstimate,
          currentEstimatePerAcre,
          projectedEstimate,
        },
      })
    },
    []
  )

  const deleteNode = useCallback((rowId: string) => {
    dispatch({ type: ActionType.DELETE_NODE, payload: { rowId } })
  }, [])

  const updateLocalHistory = useCallback((payload: UpdateHistoryAction['payload']) => {
    return dispatch({ type: ActionType.UPDATE_HISTORY, payload })
  }, [])

  const clearHistory = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_HISTORY })
  }, [])

  return {
    updateNode,
    addNode,
    deleteNode,
    state,
    levels,
    updateLocalHistory,
    clearHistory,
  }
}

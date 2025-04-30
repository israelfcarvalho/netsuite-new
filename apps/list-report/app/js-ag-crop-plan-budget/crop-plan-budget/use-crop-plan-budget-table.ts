'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { useGetCropPlanLines } from '@/lib/api'
import { useBudgetTable } from '@/lib/components/budget-table/use-budget-table'
import { BudgetNode } from '@/lib/components/budget-table/use-budget-table/types'

export function useCropPlanBudgetTable() {
  const queryParams = useSearchParams()

  const cropPlanId = queryParams.get('cropPlanId')
  const { cropPlanLines, isLoading, error } = useGetCropPlanLines({ cropPlanId: Number(cropPlanId) })

  const { updateNode, addNode, deleteNode, state } = useBudgetTable({ cropPlanLines })

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    const grandTotal = nodes.reduce(
      (acc, node) => ({
        initialCost: acc.initialCost + node.initialCost,
        currentPlannedCost: acc.currentPlannedCost + node.currentPlannedCost,
        projectedCost: acc.projectedCost + node.projectedCost,
      }),
      { initialCost: 0, currentPlannedCost: 0, projectedCost: 0 }
    )

    const grandTotalNode: BudgetNode = {
      id: 'grand-total',
      rowId: 'grand-total',
      name: 'Grand Total',
      ...grandTotal,
    }

    return [grandTotalNode, ...nodes]
  }, [state.nodes])

  return {
    updateNode,
    addNode,
    deleteNode,
    state,
    isLoading,
    error: error?.message,
    data,
  }
}

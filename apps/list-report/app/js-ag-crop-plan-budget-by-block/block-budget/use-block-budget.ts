'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { useGetCropPlanLinesByRanch } from '@/lib/api/crop-plan/use-crop-plan-lines-by-ranch'
import { useBudgetTable } from '@/lib/components/budget-table/use-budget-table'
import { BudgetNode } from '@/lib/components/budget-table/use-budget-table/types'

export function useBlockBudget() {
  const queryParams = useSearchParams()

  const cropPlanId = queryParams.get('cropPlanId')
  const { cropPlanLines, isLoading, error } = useGetCropPlanLinesByRanch({ cropPlanId: Number(cropPlanId) })

  const { updateNode, state, levels } = useBudgetTable({ cropPlanLines })

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    const grandTotal = nodes.reduce(
      (acc, node) => ({
        originalEstimate: acc.originalEstimate + node.originalEstimate,
        currentEstimate: acc.currentEstimate + node.currentEstimate,
        projectedEstimate: acc.projectedEstimate + node.projectedEstimate,
        committedCost: acc.committedCost + node.committedCost,
        actualCost: acc.actualCost + node.actualCost,
      }),
      { originalEstimate: 0, currentEstimate: 0, projectedEstimate: 0, committedCost: 0, actualCost: 0 }
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
    data,
    isLoading,
    error: error?.message,
    updateNode,
    state,
    levels,
  }
}

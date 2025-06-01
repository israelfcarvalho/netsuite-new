'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { useGetCropPlanLinesByRanch } from '@/lib/api/crop-plan/use-crop-plan-lines-by-ranch'
import { BlockFilter } from '@/lib/components/budget-table/budget-table-block-filters'
import { useBudgetTable } from '@/lib/components/budget-table/use-budget-table'

export function useBlockBudget(blockFilter?: BlockFilter) {
  const queryParams = useSearchParams()

  const cropPlanId = queryParams.get('cropPlanId')
  const { cropPlanLines, isLoading, error } = useGetCropPlanLinesByRanch({
    cropPlanId: Number(cropPlanId),
    block: blockFilter?.id,
  })

  const { updateNode, state, levels } = useBudgetTable({ cropPlanLines })

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    return nodes
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

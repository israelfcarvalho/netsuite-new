'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { useGetCropPlanLines } from '@/lib/api'
import { useBudgetTable } from '@/lib/components/budget-table/use-budget-table'

export function useCropPlanBudgetTable() {
  const queryParams = useSearchParams()

  const cropPlanId = queryParams.get('cropPlanId')
  const { cropPlanLines, isLoading, error, refetch, isFetching } = useGetCropPlanLines({
    cropPlanId: Number(cropPlanId),
  })

  const { updateNode, addNode, deleteNode, state, levels } = useBudgetTable({ cropPlanLines })

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    return nodes
  }, [state.nodes])

  return {
    updateNode,
    addNode,
    deleteNode,
    state,
    isLoading: isLoading || isFetching,
    error: error?.message,
    data,
    levels,
    refresh: refetch,
  }
}

'use client'

import { useSearchParams } from 'next/navigation'

import { useToast } from '@workspace/ui/components/toast'

import { useBlockBudget } from './use-block-budget'

import { useSaveCropPlanLinesByRanch } from '@/lib/api/crop-plan/use-crop-plan-lines-by-ranch'
import { BudgetTable } from '@/lib/components/budget-table/budget-table'

export const BlockBudgetTable = () => {
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')

  const { data, isLoading, error, updateNode, state, levels } = useBlockBudget()
  const { updateLines, isPending } = useSaveCropPlanLinesByRanch()

  const handleSave = () => {
    const lines = Array.from(state.nodes.values())
      .filter((item) => !item.children && item.id !== 'grand-total')
      .map((item) => {
        const costType = item
        const costCode = state.nodes.get(costType.parentRowId ?? '')
        const division = state.nodes.get(costCode?.parentRowId ?? '')
        const ranch = state.nodes.get(division?.parentRowId ?? '')

        return {
          divisionId: Number(division?.id),
          costCodeId: Number(costCode?.id),
          costTypeId: Number(costType.id),
          ranchId: Number(ranch?.id),
          initialCost: item.initialCost,
          currentPlannedCost: item.currentPlannedCost,
          projectedCost: item.projectedCost,
        }
      })

    updateLines(Number(cropPlanId), lines, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Costs saved successfully',
          variant: 'success',
        })
        parent.refreshCalculations()
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      },
    })
  }

  return (
    <BudgetTable
      data={data}
      isLoading={isLoading}
      isSaving={isPending}
      error={error}
      onUpdate={updateNode}
      onSave={handleSave}
      state={state}
      levels={levels}
      hasBlockLevel={true}
    />
  )
}

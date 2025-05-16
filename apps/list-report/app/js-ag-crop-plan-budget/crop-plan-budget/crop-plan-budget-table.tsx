'use client'

import { useSearchParams } from 'next/navigation'

import { useToast } from '@workspace/ui/components/toast'

import { useCropPlanBudgetTable } from './use-crop-plan-budget-table'

import { CostCode, Division, CostType } from '@/lib/api'
import { useSaveCropPlanLines } from '@/lib/api/crop-plan/use-crop-plan-lines'
import { BudgetTable } from '@/lib/components/budget-table/budget-table'

export const CropPlanBudgetTable = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')
  const { updateLines, isPending } = useSaveCropPlanLines()

  const { updateNode, addNode, deleteNode, state, data, isLoading, error, levels } = useCropPlanBudgetTable()

  const handleAddNew = (newItem: {
    division: Division
    costCode: CostCode
    costType: CostType
    originalEstimate: number
    currentEstimate: number
    projectedEstimate: number
  }) => {
    const { division, costCode, costType, originalEstimate, currentEstimate, projectedEstimate } = newItem

    addNode(division, costCode, costType, originalEstimate, currentEstimate, projectedEstimate)
  }

  const handleSave = () => {
    const lines = Array.from(state.nodes.values())
      .filter((item) => !item.children && item.id !== 'grand-total')
      .map((item) => {
        const costType = item
        const costCode = state.nodes.get(costType.parentRowId ?? '')
        const division = state.nodes.get(costCode?.parentRowId ?? '')

        return {
          divisionId: Number(division?.id),
          costCodeId: Number(costCode?.id),
          costTypeId: Number(costType.id),
          originalEstimate: item.originalEstimate,
          currentEstimate: item.currentEstimate,
          projectedEstimate: item.projectedEstimate,
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
      onAddNew={handleAddNew}
      onUpdate={updateNode}
      onDelete={deleteNode}
      onSave={handleSave}
      state={state}
      levels={levels}
    />
  )
}

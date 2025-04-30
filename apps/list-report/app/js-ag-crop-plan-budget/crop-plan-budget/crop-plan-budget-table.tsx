'use client'

import { useSearchParams } from 'next/navigation'

import { useToast } from '@workspace/ui/components/toast'

import { CostCode, Division, CostType } from '@/lib/api'
import { useSaveCropPlanLines } from '@/lib/api/crop-plan/use-crop-plan-lines'
import { BudgetTable } from '@/lib/components/budget-table/budget-table'
import { useBudgetTable } from '@/lib/components/budget-table/use-budget-table'

export const CropPlanBudgetTable = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')
  const { updateLines, isPending } = useSaveCropPlanLines()

  const { data, updateNode, addNode, deleteNode, error, isLoading, state } = useBudgetTable()

  const handleAddNew = (newItem: {
    division: Division
    costCode: CostCode
    costType: CostType
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }) => {
    const { division, costCode, costType, initialCost, currentPlannedCost, projectedCost } = newItem

    addNode(division, costCode, costType, initialCost, currentPlannedCost, projectedCost)
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
      onAddNew={handleAddNew}
      onUpdate={updateNode}
      onDelete={deleteNode}
      onSave={handleSave}
      state={state}
    />
  )
}

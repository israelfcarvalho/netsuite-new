'use client'

import { useSearchParams } from 'next/navigation'

import { useToast } from '@workspace/ui/components/toast'

import { useCropPlanBudgetTable } from './use-crop-plan-budget-table'

import { CostCode, Division, CostType } from '@/lib/api'
import { useSaveCropPlanLines } from '@/lib/api/crop-plan/use-crop-plan-lines'
import { BudgetTable } from '@/lib/components/budget-table/budget-table'
import { BudgetNode } from '@/lib/components/budget-table/use-budget-table/types'

interface AddNodePayload
  extends Pick<BudgetNode, 'originalEstimate' | 'originalEstimatePerAcre' | 'currentEstimate' | 'projectedEstimate'> {
  division: Division
  costCode: CostCode
  costType: CostType
}

export const CropPlanBudgetTable = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')
  const { updateLines, isPending } = useSaveCropPlanLines()

  const { updateNode, addNode, deleteNode, state, data, isLoading, error, levels, refresh } = useCropPlanBudgetTable()

  const handleAddNew = (newItem: AddNodePayload) => {
    const {
      division,
      costCode,
      costType,
      originalEstimate,
      currentEstimate,
      projectedEstimate,
      originalEstimatePerAcre,
    } = newItem

    addNode(division, costCode, costType, originalEstimate, currentEstimate, projectedEstimate, originalEstimatePerAcre)
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
          originalEstimatePerAcre: item.originalEstimatePerAcre,
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
      onRefresh={refresh}
    />
  )
}

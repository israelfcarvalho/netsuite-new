'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { useToast } from '@workspace/ui/components/toast'

import { useGetCropPlanLines, useSaveCropPlanLines } from '@/lib/api/crop-plan/use-crop-plan-lines'
import { BudgetTable } from '@/lib/components/budget-table/budget-table'
import {
  BudgetTableProvider,
  useBudgetTableContext,
} from '@/lib/components/budget-table/use-budget-table/context/budget-table-context'
import { BudgedHistoryDataName } from '@/lib/components/budget-table/use-budget-table/types'

export const CropPlanBudgetTableComponent = ({
  isLoading,
  error,
  refresh,
}: {
  isLoading: boolean
  error: string | undefined
  refresh: () => void
}) => {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')
  const { updateLines, isPending } = useSaveCropPlanLines()
  const { state, clearHistory } = useBudgetTableContext()

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    return nodes
  }, [state.nodes])

  const handleSave = () => {
    const lines = Array.from(state.nodes.values())
      .filter((item) => !item.children && item.id !== 'grand-total')
      .map((item) => {
        const costType = item
        const costCode = state.nodes.get(costType.parentRowId ?? '')
        const division = state.nodes.get(costCode?.parentRowId ?? '')
        let history: {
          [K in BudgedHistoryDataName]?: {
            lineId: string
            previousValue: number
            newValue: number
            comment?: string
          }
        } = {}

        const localHistory = state.history.local?.[item.rowId]

        Object.values(localHistory ?? {})
          .filter((historyItem) => !!historyItem)
          .map((historyItem) => {
            history = {
              ...history,
              [historyItem.name]: {
                lineId: item.lineId,
                previousValue: historyItem.data.previousValue,
                newValue: historyItem.data.currentValue,
                comment: historyItem.data.comment,
              },
            }
          })

        return {
          divisionId: Number(division?.id),
          costCodeId: Number(costCode?.id),
          costTypeId: Number(costType.id),
          originalEstimate: item.originalEstimate,
          originalEstimatePerAcre: item.originalEstimatePerAcre,
          currentEstimate: item.currentEstimate,
          currentEstimatePerAcre: item.currentEstimatePerAcre,
          projectedEstimate: item.projectedEstimate,
          wipBalance: item.wipBalance,
          history,
        }
      })

    updateLines(Number(cropPlanId), lines, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Costs saved successfully',
          variant: 'success',
        })
        clearHistory()
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
      onSave={handleSave}
      onRefresh={refresh}
    />
  )
}

export function CropPlanBudgetTable() {
  const queryParams = useSearchParams()

  const cropPlanId = queryParams.get('cropPlanId')
  const { cropPlanLines, isLoading, error, refetch, isFetching } = useGetCropPlanLines({
    cropPlanId: Number(cropPlanId),
  })

  return (
    <BudgetTableProvider cropPlanLines={cropPlanLines}>
      <CropPlanBudgetTableComponent isLoading={isLoading || isFetching} error={error?.message} refresh={refetch} />
    </BudgetTableProvider>
  )
}

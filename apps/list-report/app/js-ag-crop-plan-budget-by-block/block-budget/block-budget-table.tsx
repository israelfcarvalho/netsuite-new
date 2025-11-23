'use client'

import { useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'

import { useToast } from '@workspace/ui/components/toast'

import { UpdateCropPlanLinesByRanch } from '@/lib/api/crop-plan/types'
import {
  useGetCropPlanLinesByRanch,
  useSaveCropPlanLinesByRanch,
} from '@/lib/api/crop-plan/use-crop-plan-lines-by-ranch'
import { BudgetTable } from '@/lib/components/budget-table/budget-table'
import { BlockFilter } from '@/lib/components/budget-table/budget-table-block-filters'
import {
  BudgetTableProvider,
  useBudgetTableContext,
} from '@/lib/components/budget-table/use-budget-table/context/budget-table-context'
import { BudgedHistoryDataName } from '@/lib/components/budget-table/use-budget-table/types'

export const BlockBudgetTableComponent = ({
  setBlockFilter,
  isLoading,
  refresh,
  error,
}: {
  setBlockFilter: Dispatch<SetStateAction<BlockFilter | undefined>>
  isLoading: boolean
  refresh: () => void
  error?: string
}) => {
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')

  const { updateLines, isPending } = useSaveCropPlanLinesByRanch()
  const { state, clearHistory } = useBudgetTableContext()

  const data = useMemo(() => {
    const nodes = Array.from(state.nodes.values()).filter((node) => !node.parentRowId)

    return nodes
  }, [state.nodes])

  const handleSave = () => {
    console.log('handleSave', state.nodes)
    const lines = Array.from(state.nodes.values())
      .filter((item) => !item.children && item.id !== 'grand-total')
      .map<UpdateCropPlanLinesByRanch>((item) => {
        const costType = item
        const costCode = state.nodes.get(costType.parentRowId ?? '')
        const division = state.nodes.get(costCode?.parentRowId ?? '')
        const ranch = state.nodes.get(division?.parentRowId ?? '')

        let history: {
          [K in BudgedHistoryDataName]?: {
            lineId: string
            previousValue: number
            newValue: number
            comment?: string
          }
        } = {}

        const localHistory = state.history.local?.[item.rowId] ?? {}
        Object.values(localHistory)
          .filter((historyItem) => !!historyItem)
          .map((historyItem) => {
            history = {
              ...history,
              [historyItem.name]: {
                lineId: historyItem.id,
                ...historyItem.data,
              },
            }
          })

        return {
          divisionId: Number(division?.id),
          costCodeId: Number(costCode?.id),
          costTypeId: Number(costType.id),
          ranchId: Number(ranch?.id),
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
      hasBlockLevel={true}
      setBlockFilter={setBlockFilter}
      onRefresh={refresh}
    />
  )
}

export function BlockBudgetTable() {
  const queryParams = useSearchParams()
  const [blockFilter, setBlockFilter] = useState<BlockFilter>()

  const cropPlanId = queryParams.get('cropPlanId')
  const { cropPlanLines, isLoading, error, refetch, isFetching } = useGetCropPlanLinesByRanch({
    cropPlanId: Number(cropPlanId),
    block: blockFilter?.id,
  })

  return (
    <BudgetTableProvider cropPlanLines={cropPlanLines}>
      <BlockBudgetTableComponent
        setBlockFilter={setBlockFilter}
        isLoading={isLoading || isFetching}
        refresh={refetch}
        error={error?.message}
      />
    </BudgetTableProvider>
  )
}

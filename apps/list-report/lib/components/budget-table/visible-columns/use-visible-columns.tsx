import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'

import { useSearchParams } from '@workspace/ui/lib/navigation'

import { BudgetNodeCalculated } from '../use-budget-table/types'

export type BudgetTableColumn = Exclude<
  keyof BudgetNodeCalculated,
  'children' | 'parentRowId' | 'id' | 'rowId' | 'lineId' | 'name' | 'totalAcres'
>

interface VisibleColumnsContext {
  allColumns: BudgetTableColumn[]
  visibleColumns: BudgetTableColumn[]
  setVisibleColumns: Dispatch<SetStateAction<BudgetTableColumn[]>>
}

export const visibleColumnsContext = createContext<VisibleColumnsContext>({
  allColumns: [],
  visibleColumns: [],
  setVisibleColumns: () => {},
})

export function useVisibleColumns() {
  const context = useContext(visibleColumnsContext)

  if (!context) {
    throw new Error('useVisibleColumns must be used within a visibleColumnsContext')
  }

  return context
}

const initialHiddenColumns: BudgetTableColumn[] = []

export function VisibleColumnsProvider({
  children,
  hasBlockLevel,
}: {
  children: React.ReactNode
  hasBlockLevel: boolean
}) {
  const searchParamsString = useSearchParams('string')

  const hideColumns = searchParamsString.getAll('hideColumn').join(',') ?? ''

  const [visibleColumns, setVisibleColumns] = useState<BudgetTableColumn[]>(initialHiddenColumns)

  const allColumns = useMemo<BudgetTableColumn[]>(() => {
    const columns: BudgetTableColumn[] = [
      'originalEstimate',
      'originalEstimatePerAcre',
      'currentEstimate',
      'currentEstimatePerAcre',
      'projectedEstimate',
      'committedCost',
      'actualCost',
      'totalCost',
      'costsToComplete',
      'overUnder',
      'projCostComplete',
    ] as BudgetTableColumn[]

    return columns.filter((column) => !hideColumns.includes(column))
  }, [hideColumns])

  useEffect(() => {
    if (visibleColumns !== initialHiddenColumns) {
      localStorage.setItem(
        `hiddenColumns-${hasBlockLevel ? 'block' : 'division'}`,
        JSON.stringify(allColumns.filter((column) => !visibleColumns.includes(column)))
      )
    }
  }, [visibleColumns, allColumns, hasBlockLevel])

  useEffect(() => {
    const hiddenColumns: BudgetTableColumn[] = []
    const storageHiddenColumns = localStorage.getItem(`hiddenColumns-${hasBlockLevel ? 'block' : 'division'}`)
    if (storageHiddenColumns) {
      const parsedHiddenColumns = JSON.parse(storageHiddenColumns)

      if (Array.isArray(parsedHiddenColumns)) {
        hiddenColumns.push(...parsedHiddenColumns)
      }
    }

    setVisibleColumns(allColumns.filter((column) => !hiddenColumns.includes(column)))
  }, [allColumns, hasBlockLevel])

  return (
    <visibleColumnsContext.Provider value={{ allColumns, visibleColumns, setVisibleColumns }}>
      {children}
    </visibleColumnsContext.Provider>
  )
}

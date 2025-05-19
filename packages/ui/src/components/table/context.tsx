import { createContext, Dispatch, SetStateAction, useContext } from 'react'

import { TData, TableColumn } from './types'

export interface TableState<T extends TData> {
  columns: TableColumn<T>[]
  expandedRows: Set<string>
  onExpandRow: (id: string) => void
  data: (T | null)[]
  error?: string
  headerElementsSize: Map<string, { clientWidth: number; offsetWidth: number; scrollWidth: number }>
  setHeaderElementsSize: Dispatch<
    SetStateAction<Map<string, { clientWidth: number; offsetWidth: number; scrollWidth: number }>>
  >
}

export const TableContext = createContext<TableState<TData> | null>(null)

export function useTableContext<T extends TData>(): TableState<T> {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error('Table components must be used within Table.Root')
  }

  return context as unknown as TableState<T>
}

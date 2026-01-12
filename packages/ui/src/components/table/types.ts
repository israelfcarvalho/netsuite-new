import React from 'react'

export interface TableColumnOptions<T extends TData> {
  isFixed?: boolean
  className?: (props: { column: TableColumn<T> }) => string | undefined
}

export interface TData {
  id: string
  name: string
  children?: TData[]
  rowId: string
  parentRowId?: string
}

export interface TableColumn<T extends TData> {
  accessorKey: keyof T
  header:
    | string
    | ((props: { column: TableColumn<T>; expandLevel: (direction: 'up' | 'down') => void }) => React.ReactNode)
  cell?: <D extends TData = T>(props: { row: { original: D }; getValue: () => unknown }) => React.ReactNode
  options?: TableColumnOptions<T>
}

export interface TableProps<T extends TData> extends React.PropsWithChildren {
  data: (T | null)[]
  columns: TableColumn<T>[]
  className?: string
  error?: string
  isLoading?: boolean
}

export type ExpandableTableProps<T extends TData> = TableProps<T>

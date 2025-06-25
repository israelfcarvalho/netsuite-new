'use client'

import React from 'react'

import { TableContext, TableState } from '../context'
import { TData, ExpandableTableProps } from '../types'

export function Root<T extends TData>({
  columns,
  data,
  error,
  children,
}: Omit<ExpandableTableProps<T>, 'className' | 'isLoading'>) {
  const mounted = React.useRef(false)
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
  const [headerElementsSize, setHeaderElementsSize] = React.useState<
    Map<string, { clientWidth: number; offsetWidth: number; scrollWidth: number }>
  >(new Map())

  const expandRow = React.useCallback(
    <T extends TData | null>(row: T) => {
      if (row?.children?.length) {
        expandedRows.add(row.rowId)
        row.children.forEach((child) => expandRow<typeof child>(child))
      }
    },
    [expandedRows]
  )

  React.useEffect(() => {
    if (data.length && !mounted.current) {
      mounted.current = true
      const expandedRows = new Set<string>()

      data.forEach((row) => {
        expandRow<typeof row>(row)
      })

      setExpandedRows(expandedRows)
    }
  }, [data, expandRow])

  const state = React.useMemo<TableState<T>>(
    () => ({
      columns,
      expandedRows,
      data,
      error,
      onExpandRow: (rowId: string) => {
        setExpandedRows((prev) => {
          const next = new Set(prev)

          if (next.has(rowId)) {
            next.delete(rowId)
            console.log('delete', rowId, next)
          } else {
            next.add(rowId)
          }
          return next
        })
      },
      headerElementsSize,
      setHeaderElementsSize,
    }),
    [columns, expandedRows, data, error, headerElementsSize, setHeaderElementsSize]
  )

  return <TableContext.Provider value={state as unknown as TableState<TData>}>{children}</TableContext.Provider>
}

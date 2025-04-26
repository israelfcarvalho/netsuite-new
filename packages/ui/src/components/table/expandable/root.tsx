'use client'

import React from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { TableContext, TableState } from '../context'
import { TData, ExpandableTableProps } from '../types'
import { ExpandableTableSkeleton } from './skeleton'

export function Root<T extends TData>({
  columns,
  data,
  className,
  children,
  isLoading,
  error,
}: ExpandableTableProps<T>) {
  const mounted = React.useRef(false)
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (data.length) {
      const expandedRows = new Set<string>()

      function expandRow<T extends TData | null>(row: T) {
        if (row?.children?.length) {
          mounted.current = true
          expandedRows.add(row.rowId)
          row.children.forEach((child) => expandRow<typeof child>(child))
        }
      }

      data.forEach((row) => {
        expandRow<typeof row>(row)
      })

      setExpandedRows(expandedRows)
    }
  }, [data, mounted])

  const state = React.useMemo<TableState<T>>(
    () => ({
      columns,
      expandedRows,
      data,
      error,
      onExpandRow: (rowId: string) => {
        setExpandedRows((prev) => {
          console.log({ prev, rowId })

          const next = new Set(prev)
          if (next.has(rowId)) {
            next.delete(rowId)
          } else {
            next.add(rowId)
          }
          return next
        })
      },
    }),
    [columns, expandedRows, data, error]
  )

  if (isLoading) {
    return <ExpandableTableSkeleton columns={columns} />
  }

  return (
    <TableContext.Provider value={state as unknown as TableState<TData>}>
      <div className={cn('overflow-auto shadow-[0_0_0px_1px] shadow-neutral-50 text-sm', className)}>
        <table className="w-full">{children}</table>
      </div>
    </TableContext.Provider>
  )
}

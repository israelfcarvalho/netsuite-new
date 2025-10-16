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

  const [levelToExpand, setLevelToExpand] = React.useState<number>(0)

  const expandLevelRows = React.useCallback(
    (rows: T[], expandedRows = new Set<string>(), currentLevel: number, endLevel: number): boolean => {
      if (currentLevel === endLevel || rows.length === 0) {
        return !!rows.length
      }

      const levelExists = rows.map((row) => {
        if (row) {
          expandedRows.add(row.rowId)
          return expandLevelRows((row.children as unknown as T[]) ?? [], expandedRows, currentLevel + 1, endLevel)
        }
        return false
      })

      return levelExists.some((exists) => exists)
    },
    []
  )

  const expandLevel = React.useCallback(
    (direction: 'up' | 'down') => {
      const nextLevel = direction === 'up' ? levelToExpand - 1 : levelToExpand + 1

      if (nextLevel >= 0) {
        setLevelToExpand(nextLevel)
        const expandedRows = new Set<string>()
        const levelExists = expandLevelRows(data as T[], expandedRows, 0, nextLevel)

        console.log('levelExists', levelExists)

        if (levelExists) {
          setExpandedRows(expandedRows)
        } else {
          setLevelToExpand(nextLevel - 1)
        }
      }
    },
    [data, expandLevelRows, levelToExpand]
  )

  const expandAll = React.useCallback(
    (rows = data, expandedRows = new Set<string>(), level = 0) => {
      const nextLevel = level + 1
      rows.forEach((row) => {
        if (row) {
          expandedRows.add(row.rowId)
          if (row.children?.length) {
            level = expandAll(row.children as unknown as T[], expandedRows, nextLevel)
          }
        }
      })

      if (rows === data) {
        setLevelToExpand(level)
        setExpandedRows(expandedRows)
      }

      return level
    },
    [data]
  )

  React.useEffect(() => {
    if (data.length && !mounted.current) {
      mounted.current = true
      expandAll()
    }
  }, [data.length, expandAll])

  const state = React.useMemo<TableState<T>>(
    () => ({
      columns,
      expandedRows,
      data,
      error,
      onExpandRow: (rowIds: string[]) => {
        setExpandedRows((prev) => {
          const next = new Set(prev)

          rowIds.forEach((rowId) => {
            if (next.has(rowId)) {
              next.delete(rowId)
            } else {
              next.add(rowId)
            }
          })

          return next
        })
      },
      expandLevel,
      headerElementsSize,
      setHeaderElementsSize,
    }),
    [columns, expandedRows, data, error, headerElementsSize, setHeaderElementsSize, expandLevel]
  )

  return <TableContext.Provider value={state as unknown as TableState<TData>}>{children}</TableContext.Provider>
}

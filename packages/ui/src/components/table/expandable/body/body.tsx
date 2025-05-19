'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { Fragment } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { Button } from '../../../button'
import { useTableContext } from '../../context'
import { TData } from '../../types'
import { getFixedColumnLeftPosition } from '../_common/utils/layout'
import { BodyProps } from '../types'

export const Body = <T extends TData>({ className }: BodyProps) => {
  const { columns, expandedRows, onExpandRow, data, error, headerElementsSize } = useTableContext<T>()

  const renderRow = (row: T, level = 0): React.ReactElement => {
    const isExpanded = expandedRows.has(row.rowId)
    const rowHasChildren = !!row.children?.length

    return (
      <Fragment key={row.id}>
        <tr
          className={cn('z-0 border-x bg-neutral-10', { 'border-y-none': rowHasChildren }, className)}
          data-level={level}
          data-has-children={rowHasChildren}
        >
          {columns.map((column, index) => {
            const value = row[column.accessorKey as keyof T]
            const displayValue = String(value ?? '')
            if (index === 0) {
              return (
                <td
                  key={column.accessorKey.toString()}
                  className={cn('px-4 bg-inherit py-2 border-r relative', {
                    'border-x-0': rowHasChildren,
                    'sticky z-10 shadow-[2px_0_3px_0] shadow-neutral-10 border-spacing-4': column.options?.isFixed,
                  })}
                  style={{
                    left: getFixedColumnLeftPosition(
                      column.accessorKey.toString(),
                      column.options?.isFixed || false,
                      columns,
                      headerElementsSize
                    ),
                  }}
                >
                  <div className="flex items-center">
                    <div style={{ width: `${level * 20}px` }} className="flex-none" />
                    {rowHasChildren ? (
                      <Button
                        variant="ghost"
                        onClick={() => onExpandRow(row.rowId)}
                        className="pr-1 hover:bg-neutral-10 rounded flex-none cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    ) : (
                      level !== 0 && <div className="w-7 flex-none flex items-center justify-center">•</div>
                    )}
                    {column.cell ? (
                      column.cell({ row: { original: row }, getValue: () => value })
                    ) : (
                      <span className="truncate">{displayValue}</span>
                    )}
                  </div>
                </td>
              )
            }

            return (
              <td
                key={column.accessorKey.toString()}
                className={cn('px-4 bg-inherit py-2 border-r text-right relative', {
                  'border-x-0': rowHasChildren,
                  'sticky z-10 shadow-[2px_0_3px_0] shadow-neutral-10 border-spacing-4': column.options?.isFixed,
                })}
                style={{
                  left: getFixedColumnLeftPosition(
                    column.accessorKey.toString(),
                    column.options?.isFixed || false,
                    columns,
                    headerElementsSize
                  ),
                }}
              >
                {column.cell ? (
                  column.cell({ row: { original: row }, getValue: () => value })
                ) : (
                  <span>{displayValue}</span>
                )}
              </td>
            )
          })}
        </tr>
        {isExpanded && rowHasChildren && row.children?.map((child) => renderRow(child as T, level + 1))}
      </Fragment>
    )
  }

  function renderError() {
    return (
      <tr>
        <td colSpan={columns.length}>
          <div className="text-neutral-100 bg-danger-40 p-2 text-center">{error}</div>
        </td>
      </tr>
    )
  }

  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {error
        ? renderError()
        : data.map((dataRow, index) => {
            if (!dataRow) {
              return <tr key={`empty-row-${index}`} />
            }

            return renderRow(dataRow)
          })}
    </tbody>
  )
}

import { ChevronDown } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

import { RowProps } from './row.types'
import { getFixedColumnLeftPosition } from '../../_common/utils/layout'
import { useTableContext } from '../../context'
import { TData } from '../../table.types'

export function TableBodyRow<T extends TData>({ className, ref, row, level = 0 }: RowProps<T>) {
  const { columns, expandedRows, headerElementsSize, onExpandRow } = useTableContext<T>()
  const isExpanded = expandedRows.has(row.rowId)
  const rowHasChildren = !!row.children?.length

  return (
    <Fragment key={row.rowId}>
      <div
        ref={ref}
        role="row"
        className={cn('grid bg-neutral-10 hover:bg-neutral-40', className)}
        data-level={level}
        data-has-children={rowHasChildren}
      >
        {columns.map((column, index) => {
          const value = row[column.accessorKey]
          const isFirstColumn = index === 0
          const hasExpandableAction = rowHasChildren && isFirstColumn

          return (
            <div
              key={column.accessorKey.toString()}
              role="cell"
              className={cn('h-full flex items-center', {
                'sticky z-10 border-top': column.options?.isFixed,
              })}
              style={{
                left: getFixedColumnLeftPosition(
                  column.accessorKey.toString(),
                  column.options?.isFixed || false,
                  columns,
                  headerElementsSize
                ),
                paddingLeft: `${level * 20}px`,
              }}
            >
              {hasExpandableAction && (
                <Button
                  variant="ghost"
                  onClick={() => onExpandRow(row.rowId)}
                  className="mr-1 pr-1 hover:bg-inherit hover:inset-shadow hover:shadow-[0_0_4px_0_inset] active:shadow-[0_0_16px_0_inset]  rounded flex-none cursor-pointer"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}
              {column.cell({ row: { original: row }, getValue: () => value })}
            </div>
          )
        })}
      </div>
      {isExpanded && rowHasChildren && <TableBodyRow row={row} level={level + 1} />}
    </Fragment>
  )
}

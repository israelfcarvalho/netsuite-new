'use client'

import { cn } from '@workspace/ui/lib/utils'

import { useTableContext } from '../context'
import { TData } from '../types'

export const Header = <T extends TData>() => {
  const { columns, setHeaderElementsSize, headerElementsSize } = useTableContext<T>()

  function referenceHeaderElements(el: HTMLTableCellElement | null, header: string) {
    const headerElementSize = headerElementsSize.get(header)
    const updateIt = !!el && headerElementSize?.offsetWidth !== el?.offsetWidth

    if (updateIt) {
      setHeaderElementsSize((prevHeaderElementsSize) => {
        const newHeaderElementsSize = new Map(prevHeaderElementsSize)
        newHeaderElementsSize.set(header, {
          clientWidth: el?.clientWidth,
          offsetWidth: el?.offsetWidth,
          scrollWidth: el?.scrollWidth,
        })
        return newHeaderElementsSize
      })
    }
  }

  const leftFixedColumns = (header: string, isFixed: boolean = false) => {
    if (!isFixed) {
      return undefined
    }

    let foundBondries = false

    const left = columns.reduce((acc, column) => {
      if (column.accessorKey === header) {
        foundBondries = true
      }

      if (foundBondries) {
        return acc
      }

      const columnWidth = headerElementsSize.get(column.accessorKey.toString())?.clientWidth || 0

      return acc + columnWidth
    }, 0)

    return left
  }

  return (
    <thead className="sticky top-0 bg-neutral-30 shadow z-20">
      <tr className="text-left whitespace-nowrap">
        {columns.map((column) => (
          <th
            ref={(el) => referenceHeaderElements(el, column.accessorKey.toString())}
            key={column.accessorKey.toString()}
            className={cn('px-4 py-3 text-neutral-120 font-bold border', {
              'sticky top-0 bg-neutral-30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]': column.options?.isFixed,
            })}
            style={{
              left: leftFixedColumns(column.accessorKey.toString(), column.options?.isFixed),
            }}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  )
}

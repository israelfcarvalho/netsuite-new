'use client'

import { useWindowResize } from '@workspace/ui/lib/browser'
import { cn } from '@workspace/ui/lib/style'

import { useTableContext } from '../context'
import { TData } from '../types'
import { getFixedColumnLeftPosition } from './_common/utils/layout'

export const Header = <T extends TData>() => {
  useWindowResize()
  const { columns, setHeaderElementsSize, headerElementsSize, expandLevel } = useTableContext<T>()

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

  return (
    <thead className="sticky top-0 bg-neutral-30 shadow-[0_2px_4px_0px]  py-2 text-sm leading-normal shadow-neutral-50 z-20">
      <tr className="text-left whitespace-nowrap">
        {columns.map((column) => {
          return (
            <th
              ref={(el) => referenceHeaderElements(el, column.accessorKey.toString())}
              key={column.accessorKey.toString()}
              className={cn('px-4 py-3 text-neutral-120 font-bold', column.options?.className?.({ column }), {
                'sticky top-0 bg-neutral-30 z-20': column.options?.isFixed,
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
              {typeof column.header === 'function' ? column.header({ column, expandLevel }) : column.header}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

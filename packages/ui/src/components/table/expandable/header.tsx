'use client'

import { useTableContext } from '../context'
import { TData } from '../types'

export const Header = <T extends TData>() => {
  const { columns } = useTableContext<T>()

  return (
    <thead className="sticky top-0 bg-neutral-50 shadow z-10">
      <tr className="text-left whitespace-nowrap">
        {columns.map((column) => (
          <th key={column.accessorKey.toString()} className="px-4 py-3 text-neutral-120 font-bold border">
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  )
}

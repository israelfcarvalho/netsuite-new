'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'

import { TableProps, TData } from './types'

export function Table<T extends TData>({ data, columns, className = '' }: TableProps<T>): React.ReactElement {
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T | null>[],
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={`rounded-lg overflow-auto border border-gray-200 shadow-2xl shadow-gray-500/20 ${className}`}>
      <table className="size-full border-collapse bg-white overflow-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50 text-left whitespace-nowrap">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-4 text-gray-600 font-normal border-b border-r"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 border-r">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

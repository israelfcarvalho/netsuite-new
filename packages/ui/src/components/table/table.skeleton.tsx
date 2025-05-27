'use client'

import React from 'react'

import { Skeleton } from '@workspace/ui/components/skeleton'
import { cn } from '@workspace/ui/lib/utils'

const RowSkeleton = ({
  level = 0,
  hasChildren = false,
  columns,
}: {
  level?: number
  hasChildren?: boolean
  columns: unknown[]
}) => (
  <tr className="" data-level={level} data-has-children={hasChildren}>
    {columns.map((_, index) => {
      if (index === 0) {
        return (
          <td key={index} className={cn('px-4 py-4')}>
            <div className="flex items-center">
              <div style={{ width: `${level * 20}px` }} className="flex-none" />
              {hasChildren ? (
                <div className="p-1 rounded flex-none">
                  <Skeleton className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 flex-none flex items-center justify-center">
                  <Skeleton className="w-2 h-2 rounded-full" />
                </div>
              )}
              <Skeleton className="h-4 flex-1" />
            </div>
          </td>
        )
      }

      return (
        <td key={index} className={cn('px-4 py-4')}>
          <Skeleton className="h-4 w-full" />
        </td>
      )
    })}
  </tr>
)

export function TableSkeleton({ columns }: { columns: unknown[] }) {
  return (
    <div className={'overflow-auto'}>
      <table className="w-full">
        <thead className="sticky top-0 bg-gray-50 shadow">
          <tr className="text-left whitespace-nowrap">
            {columns.map((_, index) => (
              <th key={index} className="px-4 py-4 text-gray-600 font-normal bg-gray-50">
                <Skeleton className="h-4 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <RowSkeleton columns={columns} hasChildren={i % 2 === 0} />
              {i % 2 === 0 && (
                <>
                  <RowSkeleton columns={columns} level={1} />
                  <RowSkeleton columns={columns} level={1} />
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

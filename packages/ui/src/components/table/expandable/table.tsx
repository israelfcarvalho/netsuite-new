'use client'

import React from 'react'

import { cn } from '@workspace/ui/lib/style'

import { useTableContext } from '../context'
import { TData, ExpandableTableProps } from '../types'
import { ExpandableTableSkeleton } from './skeleton'

export function Table<T extends TData>({
  className,
  children,
  isLoading,
}: Pick<ExpandableTableProps<T>, 'className' | 'children' | 'isLoading'>) {
  const { columns } = useTableContext<T>()

  if (isLoading) {
    return <ExpandableTableSkeleton columns={columns} />
  }

  return (
    <div className={cn('relative overflow-auto shadow-[0_0_0px_1px] shadow-neutral-50 text-sm', className)}>
      <div>
        <table className="w-full border-separate border-spacing-0">{children}</table>
      </div>
    </div>
  )
}

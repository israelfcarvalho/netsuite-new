'use client'

import { Trash2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { FormInputText } from '@workspace/ui/components/form'
import { formatCurrency } from '@workspace/ui/components/form/input/text'
import { createExpandableTable, createColumn } from '@workspace/ui/components/table'
import { cn } from '@workspace/ui/lib/utils'

import { BudgetTableAddModal } from './budget-table-add-modal'
import { BudgetTableLoading } from './budget-table-loading'
import { BudgetTableProps } from './budget-table.types'
import { BudgetNode } from './use-budget-table/types'
const ExpandableTable = createExpandableTable<BudgetNode>()

export function BudgetTable({
  data,
  isLoading,
  isSaving,
  error,
  onAddNew,
  onUpdate,
  onDelete,
  onSave,
  state,
  levels,
}: BudgetTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExcelExport = (): void => {
    parent.printExcel()
  }

  const handlePDFExport = async (): Promise<void> => {
    parent.printPdf()
  }

  const columns = useMemo(
    () => [
      createColumn<BudgetNode>('id', '', ({ row }) => {
        const isLastChild = row.original.parentRowId && !row.original.children?.length
        return (
          <div className="group flex items-center gap-2">
            {isLastChild && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(row.original.rowId)}
              >
                <Trash2 className="text-bg-danger-40 h-4 w-4" />
              </Button>
            )}
            <span>{row.original.name}</span>
          </div>
        )
      }),
      createColumn<BudgetNode>('initialCost', 'Initial Cost', ({ row }) => {
        const value = (row.original as unknown as BudgetNode).initialCost
        const hasChildren = row.original.children?.length
        if (onUpdate && !hasChildren && row.original.id !== 'grand-total') {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  onUpdate(row.original.rowId, { initialCost: value })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
      createColumn<BudgetNode>('currentPlannedCost', 'Current Planned Cost', ({ row }) => {
        const value = (row.original as unknown as BudgetNode).currentPlannedCost
        const hasChildren = row.original.children?.length
        if (onUpdate && !hasChildren && row.original.id !== 'grand-total') {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  onUpdate(row.original.rowId, {
                    currentPlannedCost: value,
                  })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
      createColumn<BudgetNode>('projectedCost', 'Projected Cost', ({ row }) => {
        const value = (row.original as unknown as BudgetNode).projectedCost
        const hasChildren = row.original.children?.length
        if (onUpdate && !hasChildren && row.original.id !== 'grand-total') {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  onUpdate(row.original.rowId, { projectedCost: value })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
    ],
    [onUpdate, onDelete]
  )

  return (
    <div className="size-full flex flex-col gap-4 overflow-visible relative">
      {isSaving && <BudgetTableLoading />}

      <div className="flex gap-2">
        {onAddNew && (
          <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
            Add New Cost Line
          </Button>
        )}
        <Button variant="default" size="sm" onClick={onSave} disabled={isLoading}>
          Save
        </Button>
        <div className="ml-auto flex gap-2">
          <Button className="flex-1" variant="secondary" size="sm" onClick={handleExcelExport} disabled={isLoading}>
            Export to Excel
          </Button>
          <Button className="flex-1" variant="secondary" size="sm" onClick={handlePDFExport}>
            Export to PDF
          </Button>
        </div>
      </div>

      <ExpandableTable.Root data={data} columns={columns} error={error} isLoading={isLoading}>
        <ExpandableTable.Header />
        <ExpandableTable.Body
          className={
            levels > 3
              ? cn(
                  'data-[level=0]:data-[has-children=true]:bg-pine/30 data-[level=0]:data-[has-children=true]:shadow',
                  'data-[level=1]:data-[has-children=true]:bg-brand-40',
                  'data-[level=2]:data-[has-children=true]:bg-neutral-10'
                )
              : cn(
                  'data-[level=0]:data-[has-children=true]:bg-brand-40 data-[level=0]:data-[has-children=true]:shadow',
                  'data-[level=1]:data-[has-children=true]:bg-neutral-10'
                )
          }
        />
      </ExpandableTable.Root>
      {isModalOpen && onAddNew && (
        <BudgetTableAddModal
          state={{ ...state, tree: data }}
          onAddNew={onAddNew}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

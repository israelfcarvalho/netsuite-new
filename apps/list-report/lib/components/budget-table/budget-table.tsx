'use client'

import { Trash2, Filter } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { FormInputText } from '@workspace/ui/components/form'
import { formatCurrency } from '@workspace/ui/components/form/input/text'
import { createExpandableTable, createColumn } from '@workspace/ui/components/table'
import { useSearchParams } from '@workspace/ui/lib/navigation'
import { cn } from '@workspace/ui/lib/utils'

import { BudgetTableAddModal } from './budget-table-add-modal'
import { BudgetTableBlockFilters } from './budget-table-block-filters'
import { BudgetTableExport } from './budget-table-export'
import { BudgetTableFilters } from './budget-table-filters'
import { BudgetTableLoading } from './budget-table-loading'
import { BudgetTableProps } from './budget-table.types'
import { BudgetNode } from './use-budget-table/types'
import { useBudgetTableFilters } from './use-budget-table-filters'

const ExpandableTable = createExpandableTable<BudgetNode>()

const GRAND_TOTAL_ID = 'grand-total'

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
  hasBlockLevel = false,
}: BudgetTableProps) {
  const [blockFilter, setBlockFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParamsString = useSearchParams('string')
  const searchParamsBoolean = useSearchParams('boolean')

  const blockEC = searchParamsString.getAll('blockEC')
  const blockRR = !!searchParamsBoolean.get('blockRR')
  const blockNL = !!searchParamsBoolean.get('blockNL')

  const {
    divisionId,
    costCodeId,
    costTypeId,
    setDivisionId,
    setCostCodeId,
    setCostTypeId,
    resetFilters,
    filteredData,
  } = useBudgetTableFilters(data, hasBlockLevel, blockFilter)

  const columns = useMemo(
    () => [
      createColumn<BudgetNode>('id', '', ({ row }) => {
        const isLastChild = row.original.parentRowId && !row.original.children?.length
        const blockRemoveRow = blockRR
        const canRemove = !blockRemoveRow && onDelete && isLastChild

        return (
          <div className="group flex items-center gap-2">
            {canRemove && (
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
        const isBlockEC = blockEC.includes('initialCost')

        const canEdit = !hasChildren && row.original.id !== GRAND_TOTAL_ID && !isBlockEC

        if (canEdit) {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  onUpdate(row.original.rowId, { initialCost: value })
                }}
                changeOnBlur
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
      createColumn<BudgetNode>('currentPlannedCost', 'Current Planned Cost', ({ row }) => {
        const value = (row.original as unknown as BudgetNode).currentPlannedCost
        const hasChildren = row.original.children?.length
        const isBlockEC = blockEC.includes('currentPlannedCost')

        const canEdit = !hasChildren && row.original.id !== GRAND_TOTAL_ID && !isBlockEC

        if (canEdit) {
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
                changeOnBlur
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
      createColumn<BudgetNode>('projectedCost', 'Projected Cost', ({ row }) => {
        const value = (row.original as unknown as BudgetNode).projectedCost
        const hasChildren = row.original.children?.length
        const isBlockEC = blockEC.includes('projectedCost')

        const canEdit = !hasChildren && row.original.id !== GRAND_TOTAL_ID && !isBlockEC

        if (canEdit) {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  onUpdate(row.original.rowId, { projectedCost: value })
                }}
                changeOnBlur
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
    ],
    [onUpdate, onDelete, blockEC, blockRR]
  )

  const onlyGrandTotal = filteredData?.length === 1 && filteredData[0]?.id === GRAND_TOTAL_ID

  return (
    <div className="size-full flex flex-col gap-4 overflow-visible relative">
      {isSaving && <BudgetTableLoading />}

      <div className="flex gap-2">
        {onAddNew && !blockNL && (
          <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
            Add New Cost Line
          </Button>
        )}
        <Button variant="default" size="sm" onClick={onSave} disabled={isLoading}>
          Save
        </Button>
        <BudgetTableExport isLoading={isLoading} />
      </div>

      <div className="flex flex-col flex-1 overflow-auto py-2 px-2">
        <div className="grid grid-rows-[1fr] grid-cols-[auto_1fr] mb-2 gap-x-1 gap-y-1 overflow-visible">
          <div
            className={cn(
              'w-fit row-span-2 flex items-center text-[12px] font-semibold text-neutral-100 rounded-l-lg px-2 py-1 bg-neutral-10 shadow-neutral-40 shadow-[-2px_0px_2px_1px]',
              {
                'row-span-1': !hasBlockLevel,
              }
            )}
          >
            <Filter className="size-2.5 mr-2 text-gray-500" />
            Filters
          </div>
          {hasBlockLevel && <BudgetTableBlockFilters onChange={setBlockFilter} />}
          <BudgetTableFilters
            divisionId={divisionId}
            costCodeId={costCodeId}
            costTypeId={costTypeId}
            setDivisionId={setDivisionId}
            setCostCodeId={setCostCodeId}
            setCostTypeId={setCostTypeId}
            resetFilters={resetFilters}
            hasBlockLevel={hasBlockLevel}
          />
        </div>
        <ExpandableTable.Root data={filteredData ?? []} columns={columns} error={error} isLoading={isLoading}>
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
          {onlyGrandTotal && (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-neutral-60 border-t bg-neutral-5">
                  No matching data found. Try adjusting your filters to see more results.
                </td>
              </tr>
            </tbody>
          )}
        </ExpandableTable.Root>
        {isModalOpen && onAddNew && (
          <BudgetTableAddModal
            state={{ ...state, tree: data }}
            onAddNew={onAddNew}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

'use client'

import { Trash2, Filter } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { FormInputText } from '@workspace/ui/components/form'
import { formatCurrency } from '@workspace/ui/components/form/input/text'
import { createExpandableTable, createColumn, TableColumn } from '@workspace/ui/components/table'
import { useSearchParams } from '@workspace/ui/lib/navigation'
import { cn } from '@workspace/ui/lib/utils'

import { BudgetTableAddModal } from './budget-table-add-modal'
import { BudgetTableBlockFilters } from './budget-table-block-filters'
import { BudgetTableExport } from './budget-table-export'
import { BudgetTableFilters } from './budget-table-filters'
import { BudgetTableLoading } from './budget-table-loading'
import { BudgetTableProps } from './budget-table.types'
import { BudgetNode, BudgetNodeCalculated } from './use-budget-table/types'
import { useBudgetTableFilters } from './use-budget-table-filters'

const ExpandableTable = createExpandableTable<BudgetNode>()

const GRAND_TOTAL_ID = 'grand-total'

function BudgetTableComponent({
  data,
  isLoading,
  isSaving,
  onAddNew,
  onSave,
  state,
  levels,
  hasBlockLevel = false,
  setBlockFilter,
  onRefresh,
  columns,
}: BudgetTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParamsBoolean = useSearchParams('boolean')

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
  } = useBudgetTableFilters(data, hasBlockLevel)

  const onlyGrandTotal = filteredData?.length === 1 && filteredData[0]?.id === GRAND_TOTAL_ID

  return (
    <div className="size-full flex flex-col gap-4 overflow-visible relative">
      {isSaving && <BudgetTableLoading />}

      <div className="flex gap-2 px-2">
        {onAddNew && !blockNL && (
          <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
            Add New Cost Line
          </Button>
        )}
        <Button variant="default" size="sm" onClick={onSave} disabled={isLoading}>
          Save
        </Button>
        <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
          Refresh
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
        <ExpandableTable.Table isLoading={isLoading}>
          <ExpandableTable.Header />
          <ExpandableTable.Body
            className={
              levels > 3
                ? cn(
                    'data-[level=0]:data-[has-children=true]:bg-pine-light data-[level=0]:data-[has-children=true]:shadow',
                    'data-[level=1]:data-[has-children=true]:bg-brand-40',
                    'data-[level=2]:data-[has-children=true]:bg-neutral-20'
                  )
                : cn(
                    'data-[level=0]:data-[has-children=true]:bg-brand-40 data-[level=0]:data-[has-children=true]:shadow',
                    'data-[level=1]:data-[has-children=true]:bg-neutral-20'
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
        </ExpandableTable.Table>
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

export const BudgetTable = (props: Omit<BudgetTableProps, 'columns'>) => {
  const { data, hasBlockLevel, onUpdate, onDelete, error } = props

  const searchParamsString = useSearchParams('string')
  const searchParamsBoolean = useSearchParams('boolean')

  const blockEC = searchParamsString.getAll('blockEC')
  const blockRR = !!searchParamsBoolean.get('blockRR')

  const columns = useMemo(() => {
    const columns = [
      createColumn<BudgetNode>(
        'id',
        '',
        ({ row }) => {
          const isLastChild = row.original.parentRowId && !row.original.children?.length
          const blockRemoveRow = blockRR
          const canRemove = !blockRemoveRow && onDelete && isLastChild

          return (
            <div className="flex items-center gap-2 min-w-[200px]">
              {canRemove && (
                <div className="absolute left-4 group">
                  <Button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0"
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(row.original.rowId)}
                  >
                    <Trash2 className="text-bg-danger-40 size-4" />
                  </Button>
                </div>
              )}
              <span>{row.original.name}</span>
            </div>
          )
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'originalEstimate',
        () => <span className="text-right w-full inline-block text-brand-100/70 font-semibold">Original Plan</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).originalEstimate
          const hasChildren = row.original.children?.length
          const isBlockEC = blockEC.includes('originalEstimate')

          const canEdit = !hasChildren && row.original.id !== GRAND_TOTAL_ID && !isBlockEC

          if (canEdit) {
            return (
              <div className="relative">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    onUpdate(row.original.rowId, { originalEstimate: value })
                  }}
                  changeOnBlur
                />
              </div>
            )
          }
          return <span className="text-right">{formatCurrency(value)}</span>
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'currentEstimate',
        () => <span className="text-right w-full inline-block text-brand-100/70 font-semibold">Current Plan</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).currentEstimate
          const hasChildren = row.original.children?.length
          const isBlockEC = blockEC.includes('currentEstimate')

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
                      currentEstimate: value,
                    })
                  }}
                  changeOnBlur
                />
              </div>
            )
          }
          return <span className="text-right">{formatCurrency(value)}</span>
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'committedCost',
        () => <span className="text-right w-full inline-block text-warning-100/70 font-semibold">Committed Cost</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).committedCost
          const canEdit = false
          if (canEdit) {
            return (
              <div className="relative">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    onUpdate(row.original.rowId, { committedCost: value })
                  }}
                  changeOnBlur
                />
              </div>
            )
          }
          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      createColumn<BudgetNode>(
        'actualCost',
        () => <span className="text-right w-full inline-block text-warning-100/70 font-semibold">Actual Cost</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).actualCost
          const canEdit = false
          if (canEdit) {
            return (
              <div className="relative">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    onUpdate(row.original.rowId, { actualCost: value })
                  }}
                  changeOnBlur
                />
              </div>
            )
          }
          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      createColumn<BudgetNodeCalculated>(
        'totalCost',
        () => <span className="text-right w-full inline-block text-lilac font-semibold">Total Cost</span>,
        ({ row }) => {
          const { actualCost = 0, committedCost = 0 } = row.original as unknown as BudgetNode
          const totalCost = actualCost + committedCost
          return (
            <span className={cn('text-right', { 'text-danger-80 font-semibold': totalCost < 0 })}>
              {formatCurrency(totalCost)}
            </span>
          )
        }
      ),
      createColumn<BudgetNodeCalculated>(
        'costsToComplete',
        () => <span className="text-right w-full inline-block text-lilac font-semibold">Costs to Complete</span>,
        ({ row }) => {
          const { actualCost, committedCost, currentEstimate } = row.original as unknown as BudgetNode
          const totalCost = actualCost + committedCost
          const costsToComplete = currentEstimate - totalCost

          return (
            <span className={cn('text-right', { 'text-danger-80 font-semibold': costsToComplete < 0 })}>
              {formatCurrency(costsToComplete)}
            </span>
          )
        }
      ),
      createColumn<BudgetNode>(
        'projectedEstimate',
        () => <span className="text-right w-full inline-block text-brand-100/70 font-semibold">Projected Plan</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).projectedEstimate
          const hasChildren = row.original.children?.length
          const isBlockEC = blockEC.includes('projectedEstimate')

          const canEdit = !hasChildren && row.original.id !== GRAND_TOTAL_ID && !isBlockEC

          if (canEdit) {
            return (
              <div className="relative">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    onUpdate(row.original.rowId, { projectedEstimate: value })
                  }}
                  changeOnBlur
                />
              </div>
            )
          }
          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      createColumn<BudgetNodeCalculated>(
        'overUnder',
        () => <span className="text-right w-full inline-block text-lilac font-semibold">Over/Under</span>,
        ({ row }) => {
          const { projectedEstimate, currentEstimate } = row.original as unknown as BudgetNodeCalculated
          const overUnder = currentEstimate - projectedEstimate
          return (
            <span className={cn('text-right', { 'text-danger-80 font-semibold': overUnder < 0 })}>
              {formatCurrency(overUnder)}
            </span>
          )
        }
      ),
      createColumn<BudgetNodeCalculated>(
        'projCostComplete',
        () => <span className="text-right w-full inline-block text-lilac font-semibold">Proj. Cost Complete</span>,
        ({ row }) => {
          const { actualCost, committedCost, currentEstimate, projectedEstimate } =
            row.original as unknown as BudgetNodeCalculated
          const totalCost = actualCost + committedCost
          const costsToComplete = currentEstimate - totalCost
          const overUnder = currentEstimate - projectedEstimate
          const projCostComplete = costsToComplete - overUnder

          return (
            <span className={cn('text-right', { 'text-danger-80 font-semibold': projCostComplete < 0 })}>
              {formatCurrency(projCostComplete)}
            </span>
          )
        }
      ),
    ]

    if (!hasBlockLevel) {
      columns.splice(
        5,
        0,
        createColumn<BudgetNode>(
          'notAllocatedCost',
          () => (
            <span className="text-right w-full inline-block text-warning-100/70 font-semibold">Not Allocated Cost</span>
          ),
          ({ row }) => {
            const value = (row.original as unknown as BudgetNode).actualCost
            const canEdit = false
            if (canEdit) {
              return (
                <div className="relative">
                  <FormInputText
                    className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                    variant="currency"
                    value={value}
                    onChange={(value) => {
                      onUpdate(row.original.rowId, { notAllocatedCost: value })
                    }}
                    changeOnBlur
                  />
                </div>
              )
            }
            return <span className="text-right">{formatCurrency(value)}</span>
          }
        )
      )
    }

    return columns
  }, [blockRR, blockEC, onUpdate, onDelete, hasBlockLevel])

  return (
    <ExpandableTable.Root data={data ?? []} columns={columns as unknown as TableColumn<BudgetNode>[]} error={error}>
      <BudgetTableComponent {...props} columns={columns as unknown as TableColumn<BudgetNode>[]} />
    </ExpandableTable.Root>
  )
}

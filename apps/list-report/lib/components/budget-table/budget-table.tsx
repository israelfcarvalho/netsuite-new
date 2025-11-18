'use client'

import { Filter, PanelBottomClose, PanelBottomOpen } from 'lucide-react'
import React, { useMemo } from 'react'

import { Button } from '@workspace/ui/components/button'
import { FormInputText } from '@workspace/ui/components/form'
import { formatCurrency } from '@workspace/ui/components/form/input/text'
import { createExpandableTable, createColumn, TableColumn, useTableContext } from '@workspace/ui/components/table'
import { useSearchParams } from '@workspace/ui/lib/navigation'
import { cn } from '@workspace/ui/lib/utils'

import { BudgetTableBlockFilters } from './budget-table-block-filters'
import { BudgetTableExport } from './budget-table-export'
import { BudgetTableFilters } from './budget-table-filters'
import { BudgetTableLoading } from './budget-table-loading'
import { BudgetTableProps } from './budget-table.types'
import { BudgetNode, BudgetNodeCalculated } from './use-budget-table/types'
import { useBudgetTableFilters } from './use-budget-table-filters'
import { BudgetHistoryTableCellWrapper } from '../budget-history/table-cell-wrapper'
import { useBudgetTableContext } from './use-budget-table/context/budget-table-context'

const ExpandableTable = createExpandableTable<BudgetNode>()

const GRAND_TOTAL_ID = 'grand-total'

function BudgetTableComponent({
  isLoading,
  isSaving,
  onSave,
  hasBlockLevel = false,
  setBlockFilter,
  onRefresh,
  filteredData,
}: BudgetTableProps) {
  const { columns } = useTableContext<BudgetNode>()
  const { levels } = useBudgetTableContext()

  const onlyGrandTotal = filteredData?.data?.length === 1 && filteredData?.data[0]?.id === GRAND_TOTAL_ID

  return (
    <div className="size-full flex flex-col gap-4 overflow-visible relative">
      {isSaving && <BudgetTableLoading />}

      <div className="flex gap-2 px-2">
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
            divisionId={filteredData.divisionId}
            costCodeId={filteredData.costCodeId}
            costTypeId={filteredData.costTypeId}
            setDivisionId={filteredData.setDivisionId}
            setCostCodeId={filteredData.setCostCodeId}
            setCostTypeId={filteredData.setCostTypeId}
            resetFilters={filteredData.resetFilters}
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
                    'data-[level=1]:data-[has-children=true]:bg-brand-60',
                    'data-[level=2]:data-[has-children=true]:bg-brand-40'
                  )
                : cn(
                    'data-[level=0]:data-[has-children=true]:bg-brand-60 data-[level=0]:data-[has-children=true]:shadow',
                    'data-[level=1]:data-[has-children=true]:bg-brand-40'
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
      </div>
    </div>
  )
}

export const BudgetTable = (props: Omit<BudgetTableProps, 'columns' | 'filteredData'>) => {
  const { data, error, hasBlockLevel } = props

  const { filteredData, ...filteredDataProps } = useBudgetTableFilters(data, hasBlockLevel)
  const { updateNode } = useBudgetTableContext()

  const searchParamsString = useSearchParams('string')

  const blockEC = searchParamsString.getAll('blockEC')
  const hideColumn = searchParamsString.getAll('hideColumn')

  const columns = useMemo(() => {
    const columns = [
      createColumn<BudgetNode>(
        'id',
        ({ expandLevel }) => (
          <div className="flex flex-row items-start gap-1 w-fit">
            <Button
              title="Expand"
              className="text-start"
              variant="outline"
              size="sm"
              onClick={() => expandLevel('down')}
            >
              <PanelBottomClose className="size-4 text-neutral-100" />
            </Button>
            <Button
              title="Collapse"
              className="text-start"
              variant="outline"
              size="sm"
              onClick={() => expandLevel('up')}
            >
              <PanelBottomOpen className="size-4 text-neutral-100" />
            </Button>
          </div>
        ),
        ({ row }) => {
          return (
            <div className="flex items-center gap-2 min-w-[200px]">
              <span>{row.original.name}</span>
            </div>
          )
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'originalEstimatePerAcre',
        () => (
          <span className="inline-flex flex-col items-end w-full text-brand-100/70 font-semibold">
            <span>Original Plan</span> <span>Per Acre</span>
          </span>
        ),
        ({ row }) => {
          const originalRow = row.original as unknown as BudgetNode
          const value = originalRow.originalEstimatePerAcre
          const hasChildren = originalRow.children?.length
          const isBlockEC = blockEC.includes('originalEstimatePerAcre')

          const isEditable = !hasChildren && originalRow.id !== GRAND_TOTAL_ID
          const canEdit = isEditable && !isBlockEC

          if (canEdit) {
            return (
              <BudgetHistoryTableCellWrapper name="Original Plan Per Acre">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, { originalEstimatePerAcre: value })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { originalEstimate: value * originalRow.totalAcres })
                    }
                  }}
                  changeOnBlur={
                    !originalRow.totalAcres ||
                    originalRow.originalEstimate * originalRow.totalAcres !== originalRow.originalEstimatePerAcre
                  }
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper name="Original Plan Per Acre">
              <span className="text-right">{formatCurrency(value)}</span>
            </BudgetHistoryTableCellWrapper>
          ) : (
            <span className="text-right">{formatCurrency(value)}</span>
          )
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'originalEstimate',
        () => (
          <span className="inline-flex flex-col items-end w-full text-brand-100/70 font-semibold min-w-[150px]">
            <span>Original Plan</span> <span>Total Acres</span>
          </span>
        ),
        ({ row }) => {
          const originalRow = row.original as unknown as BudgetNode
          const value = originalRow.originalEstimate
          const hasChildren = originalRow.children?.length
          const isBlockEC = blockEC.includes('originalEstimate')

          const isEditable = !hasChildren && originalRow.id !== GRAND_TOTAL_ID
          const canEdit = isEditable && !isBlockEC

          if (canEdit) {
            return (
              <BudgetHistoryTableCellWrapper name="Original Plan Total Acres">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, { originalEstimate: value })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { originalEstimatePerAcre: value / originalRow.totalAcres })
                    }
                  }}
                  changeOnBlur={
                    !originalRow.totalAcres ||
                    originalRow.originalEstimate * originalRow.totalAcres !== originalRow.originalEstimatePerAcre
                  }
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper name="Original Plan Total Acres">
              <span className="text-right">{formatCurrency(value)}</span>
            </BudgetHistoryTableCellWrapper>
          ) : (
            <span className="text-right">{formatCurrency(value)}</span>
          )
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'currentEstimatePerAcre',
        () => (
          <span className="inline-flex flex-col items-end w-full text-brand-100/70 font-semibold">
            <span>Current Plan</span> <span>Per Acre</span>
          </span>
        ),
        ({ row }) => {
          const originalRow = row.original as unknown as BudgetNode
          const value = originalRow.currentEstimatePerAcre
          const hasChildren = originalRow.children?.length
          const isBlockEC = blockEC.includes('currentEstimatePerAcre')

          const isEditable = !hasChildren && originalRow.id !== GRAND_TOTAL_ID
          const canEdit = isEditable && !isBlockEC

          if (canEdit) {
            return (
              <BudgetHistoryTableCellWrapper name="Current Plan Per Acre">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, {
                      currentEstimatePerAcre: value,
                    })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { currentEstimate: value * originalRow.totalAcres })
                    }
                  }}
                  changeOnBlur
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper name="Current Plan Per Acre">
              <span className="text-right">{formatCurrency(value)}</span>
            </BudgetHistoryTableCellWrapper>
          ) : (
            <span className="text-right">{formatCurrency(value)}</span>
          )
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'currentEstimate',
        () => (
          <span className="inline-flex flex-col items-end w-full text-brand-100/70 font-semibold">
            <span>Current Plan</span> <span>Total Acres</span>
          </span>
        ),
        ({ row }) => {
          const originalRow = row.original as unknown as BudgetNode
          const value = originalRow.currentEstimate
          const hasChildren = originalRow.children?.length
          const isBlockEC = blockEC.includes('currentEstimate')

          const isEditable = !hasChildren && originalRow.id !== GRAND_TOTAL_ID
          const canEdit = isEditable && !isBlockEC

          if (canEdit) {
            return (
              <BudgetHistoryTableCellWrapper name="Current Plan Total Acres">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, {
                      currentEstimate: value,
                    })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { currentEstimatePerAcre: value / originalRow.totalAcres })
                    }
                  }}
                  changeOnBlur
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper name="Current Plan Total Acres">
              <span className="text-right">{formatCurrency(value)}</span>
            </BudgetHistoryTableCellWrapper>
          ) : (
            <span className="text-right">{formatCurrency(value)}</span>
          )
        },
        { isFixed: true }
      ),
      createColumn<BudgetNode>(
        'committedCost',
        () => <span className="text-right w-full inline-block text-warning-100/70 font-semibold">Committed Cost</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).committedCost

          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      createColumn<BudgetNode>(
        'actualCost',
        () => <span className="text-right w-full inline-block text-warning-100/70 font-semibold">Actual Cost</span>,
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).actualCost

          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      hasBlockLevel
        ? createColumn<BudgetNode>(
            'wipBalance',
            () => <span className="text-right w-full inline-block text-black/70 font-semibold">WIP Balance</span>,
            ({ row }) => {
              const value = (row.original as unknown as BudgetNode).wipBalance
              return <span className="text-right">{formatCurrency(value)}</span>
            }
          )
        : null,
      !hasBlockLevel
        ? createColumn<BudgetNode>(
            'wipInput',
            () => <span className="text-right w-full inline-block text-black/70 font-semibold">WIP Input</span>,
            ({ row }) => {
              const value = (row.original as unknown as BudgetNode).wipInput
              return <span className="text-right">{formatCurrency(value)}</span>
            }
          )
        : null,
      createColumn<BudgetNodeCalculated>(
        'totalCost',
        () => <span className="text-right w-full inline-block text-lilac font-semibold">Projected Cost</span>,
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

          const isEditable = !hasChildren && row.original.id !== GRAND_TOTAL_ID
          const canEdit = isEditable && !isBlockEC

          if (canEdit) {
            return (
              <BudgetHistoryTableCellWrapper name="Projected Plan">
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(row.original.rowId, { projectedEstimate: value })
                  }}
                  changeOnBlur
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper name="Projected Plan">
              <span className="text-right">{formatCurrency(value)}</span>
            </BudgetHistoryTableCellWrapper>
          ) : (
            <span className="text-right">{formatCurrency(value)}</span>
          )
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

    return columns.filter((column) => column && !hideColumn.includes(column.accessorKey))
  }, [blockEC, updateNode, hideColumn, hasBlockLevel])

  return (
    <ExpandableTable.Root
      data={filteredData ?? []}
      columns={columns as unknown as TableColumn<BudgetNode>[]}
      error={error}
    >
      <BudgetTableComponent {...props} filteredData={{ ...filteredDataProps, data: filteredData ?? [] }} />
    </ExpandableTable.Root>
  )
}

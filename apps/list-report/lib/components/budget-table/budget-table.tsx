'use client'

import { Filter, PanelBottomClose, PanelBottomOpen } from 'lucide-react'
import React, { useMemo, useState } from 'react'

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
import { BudgedHistoryDataName, BudgetNode, BudgetNodeCalculated } from './use-budget-table/types'
import { useBudgetTableFilters } from './use-budget-table-filters'
import { BudgetHistoryTableCellWrapper } from '../budget-history/table-cell-wrapper'
import { useBudgetTableContext } from './use-budget-table/context/budget-table-context'
import { BudgetHistoryModal } from '../budget-history/modal/budget-history-modal'

import { CropPlanKeysToNames } from '@/lib/utils/crop-plan/crop-plan'

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
  const [selectedBudgetHistory, setSelectedBudgetHistory] = useState<{
    field: BudgedHistoryDataName
    rowId: string
  } | null>(null)

  const { data, error, hasBlockLevel } = props

  const { filteredData, ...filteredDataProps } = useBudgetTableFilters(data, hasBlockLevel)
  const { updateNode, updateLocalHistory } = useBudgetTableContext()

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
            {CropPlanKeysToNames.originalEstimatePerAcre.map((key) => (
              <span key={key}>{key}</span>
            ))}
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
              <BudgetHistoryTableCellWrapper
                rowId={originalRow.rowId}
                name={CropPlanKeysToNames.originalEstimatePerAcre.join(' ')}
                onClick={() => setSelectedBudgetHistory({ field: 'originalEstimatePerAcre', rowId: originalRow.rowId })}
                lineId={originalRow.id}
              >
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, { originalEstimatePerAcre: value })
                    updateLocalHistory({
                      type: 'local',
                      lineId: originalRow.id,
                      rowId: originalRow.rowId,
                      name: 'originalEstimatePerAcre',
                      newValue: value,
                    })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { originalEstimate: value * originalRow.totalAcres })
                      updateLocalHistory({
                        type: 'local',
                        lineId: originalRow.id,
                        rowId: originalRow.rowId,
                        name: 'originalEstimate',
                        newValue: value * originalRow.totalAcres,
                      })
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
            <BudgetHistoryTableCellWrapper
              name={CropPlanKeysToNames.originalEstimatePerAcre.join(' ')}
              onClick={() => setSelectedBudgetHistory({ field: 'originalEstimatePerAcre', rowId: originalRow.rowId })}
              lineId={originalRow.id}
              rowId={originalRow.rowId}
            >
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
            {CropPlanKeysToNames.originalEstimate.map((key) => (
              <span key={key}>{key}</span>
            ))}
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
              <BudgetHistoryTableCellWrapper
                name={CropPlanKeysToNames.originalEstimate.join(' ')}
                onClick={() => setSelectedBudgetHistory({ field: 'originalEstimate', rowId: originalRow.rowId })}
                lineId={originalRow.id}
                rowId={originalRow.rowId}
              >
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    console.log(
                      !originalRow.totalAcres ||
                        originalRow.originalEstimate * originalRow.totalAcres !== originalRow.originalEstimatePerAcre
                    )
                    updateNode(originalRow.rowId, { originalEstimate: value })
                    updateLocalHistory({
                      type: 'local',
                      lineId: originalRow.id,
                      rowId: originalRow.rowId,
                      name: 'originalEstimate',
                      newValue: value,
                    })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { originalEstimatePerAcre: value / originalRow.totalAcres })
                      updateLocalHistory({
                        type: 'local',
                        lineId: originalRow.id,
                        rowId: originalRow.rowId,
                        name: 'originalEstimatePerAcre',
                        newValue: value / originalRow.totalAcres,
                      })
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
            <BudgetHistoryTableCellWrapper
              name={CropPlanKeysToNames.originalEstimate.join(' ')}
              onClick={() => setSelectedBudgetHistory({ field: 'originalEstimate', rowId: originalRow.rowId })}
              lineId={originalRow.id}
              rowId={originalRow.rowId}
            >
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
            {CropPlanKeysToNames.currentEstimatePerAcre.map((key) => (
              <span key={key}>{key}</span>
            ))}
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
              <BudgetHistoryTableCellWrapper
                name={CropPlanKeysToNames.currentEstimatePerAcre.join(' ')}
                onClick={() => setSelectedBudgetHistory({ field: 'currentEstimatePerAcre', rowId: originalRow.rowId })}
                lineId={originalRow.id}
                rowId={originalRow.rowId}
              >
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, {
                      currentEstimatePerAcre: value,
                    })
                    updateLocalHistory({
                      type: 'local',
                      lineId: originalRow.id,
                      rowId: originalRow.rowId,
                      name: 'currentEstimatePerAcre',
                      newValue: value,
                    })

                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { currentEstimate: value * originalRow.totalAcres })
                      updateLocalHistory({
                        type: 'local',
                        lineId: originalRow.id,
                        rowId: originalRow.rowId,
                        name: 'currentEstimate',
                        newValue: value * originalRow.totalAcres,
                      })
                    }
                  }}
                  changeOnBlur
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper
              name={CropPlanKeysToNames.currentEstimatePerAcre.join(' ')}
              onClick={() => setSelectedBudgetHistory({ field: 'currentEstimatePerAcre', rowId: originalRow.rowId })}
              lineId={originalRow.id}
              rowId={originalRow.rowId}
            >
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
            {CropPlanKeysToNames.currentEstimate.map((key) => (
              <span key={key}>{key}</span>
            ))}
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
              <BudgetHistoryTableCellWrapper
                name={CropPlanKeysToNames.currentEstimate.join(' ')}
                onClick={() => setSelectedBudgetHistory({ field: 'currentEstimate', rowId: originalRow.rowId })}
                lineId={originalRow.id}
                rowId={originalRow.rowId}
              >
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(originalRow.rowId, {
                      currentEstimate: value,
                    })
                    updateLocalHistory({
                      type: 'local',
                      lineId: originalRow.id,
                      rowId: originalRow.rowId,
                      name: 'currentEstimate',
                      newValue: value,
                    })
                    if (originalRow.totalAcres) {
                      updateNode(originalRow.rowId, { currentEstimatePerAcre: value / originalRow.totalAcres })
                      updateLocalHistory({
                        type: 'local',
                        lineId: originalRow.id,
                        rowId: originalRow.rowId,
                        name: 'currentEstimatePerAcre',
                        newValue: value / originalRow.totalAcres,
                      })
                    }
                  }}
                  changeOnBlur
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper
              name={CropPlanKeysToNames.currentEstimate.join(' ')}
              onClick={() => setSelectedBudgetHistory({ field: 'currentEstimate', rowId: originalRow.rowId })}
              lineId={originalRow.id}
              rowId={originalRow.rowId}
            >
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
        () => (
          <span className="text-right w-full inline-block text-warning-100/70 font-semibold">
            {CropPlanKeysToNames.committedCost.join(' ')}
          </span>
        ),
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).committedCost

          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      createColumn<BudgetNode>(
        'actualCost',
        () => (
          <span className="text-right w-full inline-block text-warning-100/70 font-semibold">
            {CropPlanKeysToNames.actualCost.join(' ')}
          </span>
        ),
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).actualCost

          return <span className="text-right">{formatCurrency(value)}</span>
        }
      ),
      hasBlockLevel
        ? createColumn<BudgetNode>(
            'wipBalance',
            () => (
              <span className="text-right w-full inline-block text-black/70 font-semibold">
                {CropPlanKeysToNames.wipBalance.join(' ')}
              </span>
            ),
            ({ row }) => {
              const value = (row.original as unknown as BudgetNode).wipBalance
              return <span className="text-right">{formatCurrency(value)}</span>
            }
          )
        : null,
      !hasBlockLevel
        ? createColumn<BudgetNode>(
            'wipInput',
            () => (
              <span className="text-right w-full inline-block text-black/70 font-semibold">
                {CropPlanKeysToNames.wipInput.join(' ')}
              </span>
            ),
            ({ row }) => {
              const value = (row.original as unknown as BudgetNode).wipInput
              return <span className="text-right">{formatCurrency(value)}</span>
            }
          )
        : null,
      createColumn<BudgetNodeCalculated>(
        'totalCost',
        () => (
          <span className="text-right w-full inline-block text-lilac font-semibold">
            {CropPlanKeysToNames.projectedEstimate.join(' ')}
          </span>
        ),
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
        () => (
          <span className="text-right w-full inline-block text-lilac font-semibold">
            {CropPlanKeysToNames.costsToComplete.join(' ')}
          </span>
        ),
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
        () => (
          <span className="text-right w-full inline-block text-brand-100/70 font-semibold">
            {CropPlanKeysToNames.projectedEstimate.join(' ')}
          </span>
        ),
        ({ row }) => {
          const value = (row.original as unknown as BudgetNode).projectedEstimate
          const hasChildren = row.original.children?.length
          const isBlockEC = blockEC.includes('projectedEstimate')

          const isEditable = !hasChildren && row.original.id !== GRAND_TOTAL_ID
          const canEdit = isEditable && !isBlockEC

          if (canEdit) {
            return (
              <BudgetHistoryTableCellWrapper
                name={CropPlanKeysToNames.projectedEstimate.join(' ')}
                onClick={() => setSelectedBudgetHistory({ field: 'projectedEstimate', rowId: row.original.rowId })}
                lineId={row.original.id}
                rowId={row.original.rowId}
              >
                <FormInputText
                  className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                  variant="currency"
                  value={value}
                  onChange={(value) => {
                    updateNode(row.original.rowId, { projectedEstimate: value })
                    updateLocalHistory({
                      type: 'local',
                      lineId: row.original.id,
                      rowId: row.original.rowId,
                      name: 'projectedEstimate',
                      newValue: value,
                    })
                  }}
                  changeOnBlur
                />
              </BudgetHistoryTableCellWrapper>
            )
          }
          return isEditable ? (
            <BudgetHistoryTableCellWrapper
              name={CropPlanKeysToNames.projectedEstimate.join(' ')}
              onClick={() => setSelectedBudgetHistory({ field: 'projectedEstimate', rowId: row.original.rowId })}
              lineId={row.original.id}
              rowId={row.original.rowId}
            >
              <span className="text-right">{formatCurrency(value)}</span>
            </BudgetHistoryTableCellWrapper>
          ) : (
            <span className="text-right">{formatCurrency(value)}</span>
          )
        }
      ),
      createColumn<BudgetNodeCalculated>(
        'overUnder',
        () => (
          <span className="text-right w-full inline-block text-lilac font-semibold">
            {CropPlanKeysToNames.overUnder.join(' ')}
          </span>
        ),
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
        () => (
          <span className="text-right w-full inline-block text-lilac font-semibold">
            {CropPlanKeysToNames.projCostComplete.join(' ')}
          </span>
        ),
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
  }, [blockEC, updateNode, hideColumn, hasBlockLevel, updateLocalHistory])

  return (
    <ExpandableTable.Root
      data={filteredData ?? []}
      columns={columns as unknown as TableColumn<BudgetNode>[]}
      error={error}
    >
      <BudgetTableComponent {...props} filteredData={{ ...filteredDataProps, data: filteredData ?? [] }} />
      {selectedBudgetHistory && (
        <BudgetHistoryModal
          field={selectedBudgetHistory.field}
          rowId={selectedBudgetHistory.rowId}
          onClose={() => setSelectedBudgetHistory(null)}
        />
      )}
    </ExpandableTable.Root>
  )
}

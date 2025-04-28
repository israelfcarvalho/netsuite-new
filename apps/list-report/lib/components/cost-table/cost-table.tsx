'use client'

import { jsPDF } from 'jspdf'
import { Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'

import { Button } from '@workspace/ui/components/button'
import { FormInputText } from '@workspace/ui/components/form'
import { createExpandableTable, createColumn, formatCurrency } from '@workspace/ui/components/table'
import { useToast } from '@workspace/ui/components/toast'
import { cn } from '@workspace/ui/lib/utils'

import { CostTableAddModal } from './cost-table-add-modal'
import { useCostTable } from './use-cost-table'
import { CostCode, CostType, Division } from '../../api'
import { CostNode } from './use-cost-table/types'
import { useSaveCropPlanLines } from '../../api/crop-plan/use-crop-plan-lines'

const ExpandableTable = createExpandableTable<CostNode>()

export function CostTable() {
  const searchParams = useSearchParams()
  const cropPlanId = searchParams.get('cropPlanId')
  const { toast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, updateNode, addNode, deleteNode, error, isLoading, state } = useCostTable()
  const { updateLines, isLoading: isSaving } = useSaveCropPlanLines()

  const handleAddNew = (newItem: {
    division: Division
    costCode: CostCode
    costType: CostType
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }) => {
    const { division, costCode, costType, initialCost, currentPlannedCost, projectedCost } = newItem

    addNode(division, costCode, costType, initialCost, currentPlannedCost, projectedCost)
  }

  const handleSave = () => {
    const lines = Array.from(state.nodes.values())
      .filter((item) => !item.children && item.id !== 'grand-total')
      .map((item) => {
        const costType = item
        const costCode = state.nodes.get(costType.parentRowId ?? '')
        const division = state.nodes.get(costCode?.parentRowId ?? '')

        return {
          divisionId: Number(division?.id),
          costCodeId: Number(costCode?.id),
          costTypeId: Number(costType.id),
          initialCost: item.initialCost,
          currentPlannedCost: item.currentPlannedCost,
          projectedCost: item.projectedCost,
        }
      })

    updateLines(Number(cropPlanId), lines, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Costs saved successfully',
          variant: 'success',
        })
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to save costs',
          variant: 'destructive',
        })
      },
    })
  }

  const handleExcelExport = (): void => {
    const headerData = [
      {
        'Cost Code': '',
        'Original Estimate': 'ORIGINAL ESTIMATE',
        'Current Estimate': 'CURRENT ESTIMATE',
        'Total Cost': 'TOTAL COST',
      },
    ]

    const bodyRows = data
      .filter((item) => item !== null)
      .map((item) => ({
        'Cost Code': `${item.name}`,
        'Initial Cost': item.initialCost,
        'Current Planned Cost': item.currentPlannedCost,
        'Projected Cost': item.projectedCost,
      }))

    const ws = XLSX.utils.json_to_sheet([...headerData, ...bodyRows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cost Report')
    XLSX.writeFile(wb, 'cost-report.xlsx')
  }

  const handlePDFExport = async (): Promise<void> => {
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF('l', 'pt')

    const tableColumns = ['', 'INITIAL COST', 'CURRENT PLANNED COST', 'PROJECTED COST']

    const tableRows = data
      .filter((item) => item !== null)
      .map((item) => [`${item.name}`, item.initialCost, item.currentPlannedCost, item.projectedCost])

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'right',
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
      margin: { top: 20 },
      theme: 'plain',
    })

    doc.save('cost-report.pdf')
  }

  const columns = useMemo(
    () => [
      createColumn<CostNode>('id', '', ({ row }) => {
        const isLastChild = row.original.parentRowId && !row.original.children?.length
        return (
          <div className="group flex items-center gap-2">
            {isLastChild && (
              <Button
                variant="destructive"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteNode(row.original.rowId)}
              >
                <Trash2 className="text-bg-danger-40 h-4 w-4" />
              </Button>
            )}
            <span>{row.original.name}</span>
          </div>
        )
      }),
      createColumn<CostNode>('initialCost', 'INITIAL COST', ({ row }) => {
        const value = (row.original as unknown as CostNode).initialCost
        if (updateNode && !row.original.children && row.original.id !== 'grand-total') {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  updateNode(row.original.rowId, { initialCost: value })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
      createColumn<CostNode>('currentPlannedCost', 'CURRENT PLANNED COST', ({ row }) => {
        const value = (row.original as unknown as CostNode).currentPlannedCost
        if (updateNode && !row.original.children && row.original.id !== 'grand-total') {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  updateNode(row.original.rowId, {
                    currentPlannedCost: value,
                  })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
      createColumn<CostNode>('projectedCost', 'PROJECTED COST', ({ row }) => {
        const value = (row.original as unknown as CostNode).projectedCost
        if (updateNode && !row.original.children && row.original.id !== 'grand-total') {
          return (
            <div className="relative">
              <FormInputText
                className="w-full text-right border-0 px-0 rounded-none focus-visible:ring-0 focus-visible:bg-neutral-10"
                variant="currency"
                value={value}
                onChange={(value) => {
                  updateNode(row.original.rowId, { projectedCost: value })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
    ],
    [updateNode, deleteNode]
  )

  return (
    <div className="size-full flex flex-col gap-4 overflow-visible">
      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          Add New Cost Line
        </Button>
        <Button variant="default" size="sm" onClick={handleSave} disabled={isLoading || isSaving}>
          Save
        </Button>
        <div className="ml-auto flex gap-2">
          <Button className="flex-1" variant="secondary" size="sm" onClick={handleExcelExport} disabled={isLoading}>
            Export to Excel
          </Button>
          <Button className="flex-1" variant="secondary" size="sm" onClick={handlePDFExport} disabled>
            Export to PDF
          </Button>
        </div>
      </div>
      <ExpandableTable.Root data={data} columns={columns} error={error} isLoading={isLoading}>
        <ExpandableTable.Header />
        <ExpandableTable.Body
          className={cn(
            'data-[level=0]:data-[has-children=true]:bg-brand-40 data-[level=0]:data-[has-children=true]:shadow',
            'data-[level=1]:data-[has-children=true]:bg-neutral-20'
          )}
        />
      </ExpandableTable.Root>
      {isModalOpen && (
        <CostTableAddModal
          state={{ ...state, tree: data }}
          onAddNew={handleAddNew}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

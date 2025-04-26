'use client'

import { jsPDF } from 'jspdf'
import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'

import { Button } from '@workspace/ui/components/button'
import { FormInputText } from '@workspace/ui/components/form'
import { createExpandableTable, createColumn, formatCurrency } from '@workspace/ui/components/table'
import { cn } from '@workspace/ui/lib/utils'

import { CostTableAddModal } from './cost-table-add-modal'
import { CostCode, CostType, Division } from '../api'
import { CostNode } from '../hooks/use-cost-table/types'
import { useCostTable } from '../hooks/use-cost-table/use-cost-table'
const ExpandableTable = createExpandableTable<CostNode>()

export function CostTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, updateNode, error, isLoading, state } = useCostTable()

  const handleAddNew = (newItem: {
    division: Division
    costCode: CostCode
    costType: CostType
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }) => {
    const { division, costCode, costType, initialCost, currentPlannedCost, projectedCost } = newItem
    // Create the new node

    const newNode: CostNode = {
      id: division.id,
      rowId: division.id,
      name: division.name,
      initialCost: 0,
      currentPlannedCost: 0,
      projectedCost: 0,
      children: [
        {
          id: costCode.id,
          rowId: division.id + costCode.id,
          parentRowId: division.id,
          name: costCode.name,
          initialCost: 0,
          currentPlannedCost: 0,
          projectedCost: 0,
          children: [
            {
              id: costType.id,
              name: costType.name,
              parentRowId: division.id + costCode.id,
              rowId: division.id + costCode.id + costType.id,
              initialCost,
              currentPlannedCost,
              projectedCost,
            },
          ],
        },
      ],
    }
    // Update the node using the updateNode function
    updateNode(newNode, newNode)
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
      createColumn<CostNode>('id', '', ({ row }) => <span>{row.original.name}</span>),
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
                  updateNode(row.original as unknown as CostNode, { initialCost: value })
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
                  console.log({ value })

                  updateNode(row.original as unknown as CostNode, {
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
                  updateNode(row.original as unknown as CostNode, { projectedCost: value })
                }}
              />
            </div>
          )
        }
        return <span className="text-right">{formatCurrency(value)}</span>
      }),
    ],
    [updateNode]
  )

  return (
    <div className="size-full flex flex-col gap-4 overflow-visible">
      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          Add New Cost Line
        </Button>
        <Button variant="default" size="sm" onClick={() => {}} disabled={isLoading}>
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
      {isModalOpen && <CostTableAddModal state={state} onAddNew={handleAddNew} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

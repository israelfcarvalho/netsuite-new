'use client'

import { jsPDF } from 'jspdf'
import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { Fragment } from 'react'
import { useState } from 'react'
import * as XLSX from 'xlsx'

import { Button } from '@workspace/ui/components/button'

interface CostItem {
  id: string
  code: string
  name: string
  originalEstimate: number
  currentEstimate: number
  totalCost: number
  committedCosts: number
  actualCosts: number
  costsToComplete: number
  projectedEstimate: number
  projCostComplete: number
  overUnder: number
  children?: CostItem[]
  level: number
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function CostTable({ data }: { data: CostItem[] }): React.ReactElement {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  if (!data.length) {
    return <div className="p-4 text-center text-gray-500">No data available</div>
  }

  const grandTotal = data[0] as CostItem
  const remainingData = grandTotal.children || []

  const handleExcelExport = (): void => {
    // Create header rows with column headers and Grand Total
    const headerData = [
      {
        'Cost Code': '',
        'Original Estimate': 'ORIGINAL ESTIMATE',
        'Current Estimate': 'CURRENT ESTIMATE',
        'Total Cost': 'TOTAL COST',
        'Committed Costs': 'COMMITTED COSTS',
        'Actual Costs': 'ACTUAL COSTS',
        'Costs to Complete': 'COSTS TO COMPLETE',
        'Projected Estimate': 'PROJECTED ESTIMATE',
        'Proj. Cost Complete': 'PROJ. COST COMPLETE',
        '(Over)/Under': '(OVER)/UNDER',
      },
      {
        'Cost Code': grandTotal.code,
        'Original Estimate': formatCurrency(grandTotal.originalEstimate),
        'Current Estimate': formatCurrency(grandTotal.currentEstimate),
        'Total Cost': formatCurrency(grandTotal.totalCost),
        'Committed Costs': formatCurrency(grandTotal.committedCosts),
        'Actual Costs': formatCurrency(grandTotal.actualCosts),
        'Costs to Complete': formatCurrency(grandTotal.costsToComplete),
        'Projected Estimate': formatCurrency(grandTotal.projectedEstimate),
        'Proj. Cost Complete': formatCurrency(grandTotal.projCostComplete),
        '(Over)/Under': formatCurrency(grandTotal.overUnder),
      },
    ]

    // Add remaining data rows
    const bodyRows = remainingData.map((item) => ({
      'Cost Code': `${item.code} ${item.name}`,
      'Original Estimate': formatCurrency(item.originalEstimate),
      'Current Estimate': formatCurrency(item.currentEstimate),
      'Total Cost': formatCurrency(item.totalCost),
      'Committed Costs': formatCurrency(item.committedCosts),
      'Actual Costs': formatCurrency(item.actualCosts),
      'Costs to Complete': formatCurrency(item.costsToComplete),
      'Projected Estimate': formatCurrency(item.projectedEstimate),
      'Proj. Cost Complete': formatCurrency(item.projCostComplete),
      '(Over)/Under': formatCurrency(item.overUnder),
    }))

    const ws = XLSX.utils.json_to_sheet([...headerData, ...bodyRows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cost Report')
    XLSX.writeFile(wb, 'cost-report.xlsx')
  }

  const handlePDFExport = async (): Promise<void> => {
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF('l', 'pt') // Landscape mode for better fit

    const tableColumns = [
      '',
      'ORIGINAL ESTIMATE',
      'CURRENT ESTIMATE',
      'TOTAL COST',
      'COMMITTED COSTS',
      'ACTUAL COSTS',
      'COSTS TO COMPLETE',
      'PROJECTED ESTIMATE',
      'PROJ. COST COMPLETE',
      '(OVER)/UNDER',
    ]

    // Add Grand Total as part of the header
    const headerRows = [
      [
        grandTotal.code,
        formatCurrency(grandTotal.originalEstimate),
        formatCurrency(grandTotal.currentEstimate),
        formatCurrency(grandTotal.totalCost),
        formatCurrency(grandTotal.committedCosts),
        formatCurrency(grandTotal.actualCosts),
        formatCurrency(grandTotal.costsToComplete),
        formatCurrency(grandTotal.projectedEstimate),
        formatCurrency(grandTotal.projCostComplete),
        formatCurrency(grandTotal.overUnder),
      ],
    ]

    // Prepare body rows (excluding Grand Total)
    const tableRows = remainingData.map((item) => [
      `${item.code} ${item.name}`,
      formatCurrency(item.originalEstimate),
      formatCurrency(item.currentEstimate),
      formatCurrency(item.totalCost),
      formatCurrency(item.committedCosts),
      formatCurrency(item.actualCosts),
      formatCurrency(item.costsToComplete),
      formatCurrency(item.projectedEstimate),
      formatCurrency(item.projCostComplete),
      formatCurrency(item.overUnder),
    ])

    autoTable(doc, {
      head: [tableColumns, ...headerRows],
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
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
      },
      margin: { top: 20 },
      theme: 'plain',
    })

    doc.save('cost-report.pdf')
  }

  const toggleRow = (id: string): void => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const renderDataRow = (item: CostItem): React.ReactElement => {
    const isExpanded = expandedRows.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    const bgColor = item.level === 1 ? 'bg-green-50' : item.level === 2 ? 'bg-blue-50' : 'bg-white'

    return (
      <Fragment key={item.id}>
        <tr className={`${bgColor}`}>
          <td className="px-4 py-4 border-r">
            <div className="flex items-center">
              <div style={{ width: `${(item.level - 1) * 20}px` }} className="flex-none" />
              {hasChildren && (
                <button onClick={() => toggleRow(item.id)} className="p-1 hover:bg-gray-100 rounded flex-none">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              {!hasChildren && <div className="w-7 flex-none flex items-center justify-center">•</div>}
              <span className="truncate">
                {item.code} {item.name}
              </span>
            </div>
          </td>
          <td className="px-4 py-4 text-right border-r">{formatCurrency(item.originalEstimate)}</td>
          <td className="px-4 py-4 text-right border-r">{formatCurrency(item.currentEstimate)}</td>
          <td className="px-4 py-4 text-right">{formatCurrency(item.totalCost)}</td>
        </tr>
        {isExpanded && item.children?.map((child) => renderDataRow(child))}
      </Fragment>
    )
  }

  return (
    <div className="size-full flex flex-col gap-4 overflow-hidden">
      <div className="flex gap-2 flex[0_0_fit-content]">
        <Button variant="outline" size="sm" onClick={handleExcelExport}>
          Export to Excel
        </Button>
        <Button variant="outline" size="sm" onClick={handlePDFExport} disabled>
          Export to PDF
        </Button>
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-2xl shadow-gray-500/20 flex-[0_1_fit-content]">
        <table className="size-full border-collapse bg-white overflow-auto">
          <colgroup>
            <col className="w-[300px] max-w-[300px]" />
            <col className="w-[180px]" />
            <col className="w-[180px]" />
            <col className="w-[160px]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 text-left whitespace-nowrap">
              <th className="px-4 py-4 text-gray-600 font-normal border-b border-r">
                <div className="flex items-center gap-1"></div>
              </th>
              <th className="px-4 py-4 text-gray-600 font-normal text-right border-b border-r">INITIAL COST</th>
              <th className="px-4 py-4 text-gray-600 font-normal text-right border-b border-r">CURRENT PLANNED COST</th>
              <th className="px-4 py-4 text-gray-600 font-normal text-right border-b">PROJECTED COST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Fixed Grand Total row */}
            <tr className="bg-white m-4">
              <td className="px-4 py-4 font-medium border-r">
                <div className="flex items-center">
                  <span>{grandTotal.code}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-right font-medium border-r">
                {formatCurrency(grandTotal.originalEstimate)}
              </td>
              <td className="px-4 py-4 text-right font-medium border-r">
                {formatCurrency(grandTotal.currentEstimate)}
              </td>
              <td className="px-4 py-4 text-right font-medium">{formatCurrency(grandTotal.totalCost)}</td>
            </tr>
            {/* Spacer row */}
            <tr className="h-4">
              <td colSpan={4} className="border-b"></td>
            </tr>
            {/* Expandable rows */}
            {remainingData.map((item) => renderDataRow(item))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

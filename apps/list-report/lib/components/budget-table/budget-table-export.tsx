import React from 'react'

import { Button } from '@workspace/ui/components/button'

interface BudgetTableExportProps {
  isLoading?: boolean
}

export function BudgetTableExport({ isLoading }: BudgetTableExportProps) {
  const handleExcelExport = (): void => {
    parent.printExcel()
  }

  const handlePDFExport = async (): Promise<void> => {
    parent.printPdf()
  }

  return (
    <div className="ml-auto flex gap-2">
      <Button className="flex-1" variant="secondary" size="sm" onClick={handleExcelExport} disabled={isLoading}>
        Export to Excel
      </Button>
      <Button className="flex-1" variant="secondary" size="sm" onClick={handlePDFExport} disabled={isLoading}>
        Export to PDF
      </Button>
    </div>
  )
}

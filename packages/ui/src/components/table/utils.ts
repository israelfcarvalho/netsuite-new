import React from 'react'

import { CurrencyCell } from './cells'
import { TableColumn, TData } from './types'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const createColumn = <T extends TData>(
  accessorKey: keyof T,
  header: string,
  cell?: TableColumn<T>['cell']
): TableColumn<T> => ({
  accessorKey,
  header,
  cell,
})

export const createCurrencyColumn = <T extends TData>(accessorKey: keyof T, header: string): TableColumn<T> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => {
    const value = getValue() as number
    return React.createElement(CurrencyCell, { value })
  },
})

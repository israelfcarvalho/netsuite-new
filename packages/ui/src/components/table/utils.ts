import { TableColumn, TData } from './types'

export const createColumn = <T extends TData>(
  accessorKey: keyof T,
  header: string,
  cell?: TableColumn<T>['cell'],
  options?: TableColumn<T>['options']
): TableColumn<T> => ({
  accessorKey,
  header,
  cell,
  options,
})

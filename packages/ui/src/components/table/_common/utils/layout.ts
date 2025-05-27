import { TableColumn, TData } from '../../table.types'
/**
 * Calculates the left position for a fixed column in the table.
 * This is used by both header and body components to position fixed columns.
 */
export const getFixedColumnLeftPosition = <T extends TData>(
  columnKey: string,
  isFixed: boolean,
  columns: TableColumn<T>[],
  headerElementsSize: Map<string, { clientWidth: number; offsetWidth: number; scrollWidth: number }>
): number | undefined => {
  if (!isFixed) {
    return undefined
  }

  let foundBoundaries = false

  const left = columns.reduce((acc, column) => {
    if (column.accessorKey === columnKey) {
      foundBoundaries = true
    }

    if (foundBoundaries) {
      return acc
    }

    const columnWidth = headerElementsSize.get(column.accessorKey.toString())?.clientWidth || 0

    return acc + columnWidth
  }, 0)

  return left
}

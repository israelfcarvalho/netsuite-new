import { TData } from '../../table.types'

export interface RowProps<T extends TData> {
  className?: string
  ref?: React.RefObject<HTMLDivElement>
  row: T
  level?: number
}

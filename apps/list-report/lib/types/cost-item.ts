import { TData } from '@workspace/ui/components/table'

export interface CostItem extends TData {
  id: string
  code: string
  name: string
  originalEstimate: number
  currentEstimate: number
  totalCost: number
  children?: CostItem[]
}

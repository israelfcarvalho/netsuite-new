import { TData } from '@workspace/ui/components/table'

export interface CostNode extends TData {
  id: string
  rowId: string
  name: string
  initialCost: number
  currentPlannedCost: number
  projectedCost: number
  children?: CostNode[]
  parentRowId?: string
}

export interface CostState {
  nodes: Map<string, CostNode>
  tree: CostNode[]
}

import { TData } from '@workspace/ui/components/table'

export interface CostNode extends TData {
  initialCost: number
  currentPlannedCost: number
  projectedCost: number
  children?: CostNode[]
}

export interface CostState {
  nodes: Record<string, CostNode>
  tree: CostNode[]
}

export interface UseCostTableReturn {
  state: CostState
  data: CostNode[]
  updateNode: (id: CostNode, updates: Partial<CostNode>) => void
  isLoading: boolean
  error?: string
}

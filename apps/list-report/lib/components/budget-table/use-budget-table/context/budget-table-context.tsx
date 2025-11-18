import { createContext, useContext } from 'react'

import { BudgetTableContextType, BudgetTableProviderProps } from './budget-table-context.types'
import { useBudgetTable } from '../use-budget-table'

export const BudgetTableContext = createContext<BudgetTableContextType | null>(null)

export function BudgetTableProvider({ children, cropPlanLines = [] }: BudgetTableProviderProps) {
  const { state, updateNode, deleteNode, levels, updateLocalHistory } = useBudgetTable({ cropPlanLines })

  return (
    <BudgetTableContext.Provider value={{ state, updateNode, deleteNode, levels, updateLocalHistory }}>
      {children}
    </BudgetTableContext.Provider>
  )
}

export function useBudgetTableContext(): BudgetTableContextType {
  const context = useContext(BudgetTableContext)

  if (!context) {
    throw new Error('useBudgetTableContext must be used within a BudgetTableProvider')
  }

  return context
}

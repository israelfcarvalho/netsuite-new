import { BudgetNode } from './types'

export const PER_ACRE_FIELDS: (keyof Pick<
  BudgetNode,
  'originalEstimate' | 'currentEstimate' | 'committedCost' | 'actualCost'
>)[] = ['originalEstimate', 'currentEstimate', 'committedCost', 'actualCost']

export function calculatePerAcreValues(totalValue: number, totalAcres: number): number {
  return Math.round((totalValue * 100) / totalAcres) / 100
}

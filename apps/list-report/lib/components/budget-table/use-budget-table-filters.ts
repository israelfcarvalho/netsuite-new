import { useCallback, useState } from 'react'

import { BudgetNode } from './use-budget-table/types'

import { useGetCostCodes, useGetCostTypes } from '@/lib/api'

export function useBudgetTableFilters(
  data: BudgetNode[] | undefined,
  hasBlockLevel: boolean = false,
  blockFilter?: string
) {
  const [divisionId, setDivisionId] = useState<string>('')
  const [costCodeId, setCostCodeId] = useState<string>('')
  const [costTypeId, setCostTypeId] = useState<string>('')

  const { data: costCodes } = useGetCostCodes({ divisionId })
  const { data: costTypes } = useGetCostTypes({ costCodeId })

  const filterCostTypes = useCallback(
    (costTypeChildren: BudgetNode[] | undefined): BudgetNode[] => {
      if (!costTypeChildren) return []
      const costType = costTypes?.find((t: { id: string }) => t.id === costTypeId)

      return costTypeChildren.reduce<BudgetNode[]>((filtered, type) => {
        if (costTypeId && costType && type.name !== costType?.name) {
          return filtered
        }
        return [...filtered, type]
      }, [])
    },
    [costTypes, costTypeId]
  )

  const filterCostCodes = useCallback(
    (costCodeChildren: BudgetNode[] | undefined): BudgetNode[] => {
      if (!costCodeChildren) return []
      const costCode = costCodes?.find((c: { id: string }) => c.id === costCodeId)

      return costCodeChildren.reduce<BudgetNode[]>((filtered, code) => {
        if (costCodeId && costCode && code.name !== costCode?.name) {
          return filtered
        }

        const filteredTypes = filterCostTypes(code.children)
        if (filteredTypes.length > 0 || !costTypeId) {
          return [...filtered, { ...code, children: filteredTypes }]
        }
        return filtered
      }, [])
    },
    [costCodes, costCodeId, costTypeId, filterCostTypes]
  )

  const filterDivisions = useCallback(
    (divisions: BudgetNode[]): BudgetNode[] => {
      if (divisionId) {
        const division = divisions.find((d) => d.id === divisionId)
        if (!division) return [] // Division filter set, but not found in data
        const filteredCodes = filterCostCodes(division.children)
        if (filteredCodes.length > 0 || !costCodeId) {
          return [{ ...division, children: filteredCodes }]
        }
        return []
      }
      // No division filter, filter all
      return divisions.reduce<BudgetNode[]>((filtered, divisionNode) => {
        const filteredCodes = filterCostCodes(divisionNode.children)
        if (filteredCodes.length > 0 || !costCodeId) {
          return [...filtered, { ...divisionNode, children: filteredCodes }]
        }
        return filtered
      }, [])
    },
    [divisionId, costCodeId, filterCostCodes]
  )

  const filterBlocks = useCallback(
    (blocks: BudgetNode[]): BudgetNode[] => {
      return blocks.reduce<BudgetNode[]>((filtered, block) => {
        if (blockFilter && !block.name.includes(blockFilter)) {
          return filtered
        }
        const filteredDivisions = filterDivisions(block.children ?? [])
        if (filteredDivisions.length > 0 || !divisionId) {
          return [...filtered, { ...block, children: filteredDivisions }]
        }
        return filtered
      }, [])
    },
    [divisionId, filterDivisions, blockFilter]
  )

  const grandTotalNode = data?.find((d) => d.id === 'grand-total')
  const nodesWithoutTotal = data?.filter((d) => d.id !== 'grand-total') ?? []

  let filteredData: BudgetNode[] = []
  if (hasBlockLevel) {
    filteredData = filterBlocks(nodesWithoutTotal)
  } else {
    filteredData = filterDivisions(nodesWithoutTotal)
  }

  // Always include grand total if it exists
  if (grandTotalNode) {
    filteredData = [grandTotalNode, ...filteredData]
  }

  const resetFilters = () => {
    setDivisionId('')
    setCostCodeId('')
    setCostTypeId('')
  }

  return {
    divisionId,
    costCodeId,
    costTypeId,
    setDivisionId,
    setCostCodeId,
    setCostTypeId,
    resetFilters,
    filteredData,
  }
}

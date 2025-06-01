import { useCallback, useMemo, useState } from 'react'

import { BudgetNode } from './use-budget-table/types'

import { useGetCostCodes, useGetCostTypes } from '@/lib/api'

function sumBudgetNodeValues(node: BudgetNode, children: BudgetNode[]): BudgetNode {
  return {
    ...node,
    originalEstimate: children.reduce((acc, child) => acc + child.originalEstimate, 0),
    currentEstimate: children.reduce((acc, child) => acc + child.currentEstimate, 0),
    projectedEstimate: children.reduce((acc, child) => acc + child.projectedEstimate, 0),
    committedCost: children.reduce((acc, child) => acc + child.committedCost, 0),
    actualCost: children.reduce((acc, child) => acc + child.actualCost, 0),
    notAllocatedCost: node.notAllocatedCost && children.reduce((acc, child) => acc + (child.notAllocatedCost ?? 0), 0),
    children: node.children ? [...children] : undefined,
  }
}

export function useBudgetTableFilters(data: BudgetNode[] = [], hasBlockLevel: boolean = false) {
  const [divisionId, setDivisionId] = useState<string>('')
  const [costCodeId, setCostCodeId] = useState<string>('')
  const [costTypeId, setCostTypeId] = useState<string>('')

  const { data: costCodes } = useGetCostCodes({ divisionId })
  const { data: costTypes } = useGetCostTypes({ costCodeId })

  const filterCostTypes = useCallback(
    (costTypeChildren: BudgetNode[] = []): BudgetNode[] => {
      const costType = costTypes?.find((ct: { id: string }) => ct.id === costTypeId)

      return costTypeChildren.filter((type) => !costType || type.name === costType.name)
    },
    [costTypes, costTypeId]
  )

  const filterCostCodes = useCallback(
    (costCodeChildren: BudgetNode[]): BudgetNode[] => {
      if (costCodeId) {
        const costCode = costCodes?.find((c: { id: string }) => c.id === costCodeId)

        return costCodeChildren.reduce<BudgetNode[]>((filtered, code) => {
          const isFilteredCostCode = code.id === costCode?.id

          if (isFilteredCostCode) {
            const filteredTypes = filterCostTypes(code.children)
            if (filteredTypes.length > 0) {
              const costCodeNode = sumBudgetNodeValues(code, filteredTypes)
              return [...filtered, costCodeNode]
            }
          }

          return filtered
        }, [])
      }

      return costCodeChildren.map((code) => {
        const filteredTypes = filterCostTypes(code.children ?? [])
        return sumBudgetNodeValues(code, filteredTypes)
      })
    },
    [costCodes, costCodeId, filterCostTypes]
  )

  const filterDivisions = useCallback(
    (divisions: BudgetNode[]): BudgetNode[] => {
      if (divisionId) {
        return divisions.reduce<BudgetNode[]>((filtered, division) => {
          const isFilteredDivision = division.id === divisionId

          if (isFilteredDivision) {
            const filteredCodes = filterCostCodes(division.children ?? [])
            if (filteredCodes.length > 0) {
              const divisionNode = sumBudgetNodeValues(division, filteredCodes)

              return [...filtered, divisionNode]
            }
          }

          return filtered
        }, [])
      }
      return divisions.map((division) => {
        const filteredCodes = filterCostCodes(division.children ?? [])
        return sumBudgetNodeValues(division, filteredCodes)
      })
    },
    [divisionId, filterCostCodes]
  )

  const filterBlocks = useCallback(
    (blocks: BudgetNode[]): BudgetNode[] => {
      return blocks.reduce<BudgetNode[]>((filtered, block) => {
        const filteredDivisions = filterDivisions(block.children ?? [])
        if (filteredDivisions.length > 0) {
          const blockNode = sumBudgetNodeValues(block, filteredDivisions)

          return [...filtered, blockNode]
        }
        return filtered
      }, [])
    },
    [filterDivisions]
  )

  const filteredData = useMemo(() => {
    if (hasBlockLevel) {
      return filterBlocks(data)
    } else {
      return filterDivisions(data)
    }
  }, [data, hasBlockLevel, filterBlocks, filterDivisions])

  const grandTotalNode = useMemo<BudgetNode>(() => {
    const grandTotal = {
      id: 'grand-total',
      rowId: 'grand-total',
      name: 'Grand Total',
      originalEstimate: 0,
      currentEstimate: 0,
      projectedEstimate: 0,
      committedCost: 0,
      actualCost: 0,
    }
    return sumBudgetNodeValues(grandTotal, filteredData)
  }, [filteredData])

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
    filteredData: [grandTotalNode, ...filteredData],
  }
}

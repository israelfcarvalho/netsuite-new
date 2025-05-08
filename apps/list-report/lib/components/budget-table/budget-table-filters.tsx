import { RefreshCw, X } from 'lucide-react'
import React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { cn } from '@workspace/ui/lib/utils'

import { useGetCostCodes, useGetCostTypes, useGetDivisions } from '@/lib/api'

interface BudgetTableFiltersProps {
  divisionId: string
  costCodeId: string
  costTypeId: string
  setDivisionId: (value: string) => void
  setCostCodeId: (value: string) => void
  setCostTypeId: (value: string) => void
  resetFilters: () => void
  hasBlockLevel: boolean
}

export function BudgetTableFilters({
  divisionId,
  costCodeId,
  costTypeId,
  setDivisionId,
  setCostCodeId,
  setCostTypeId,
  resetFilters,
  hasBlockLevel,
}: BudgetTableFiltersProps) {
  const { data: divisions } = useGetDivisions()
  const { data: costCodes } = useGetCostCodes({ divisionId })
  const { data: costTypes } = useGetCostTypes({ costCodeId })

  return (
    <div
      className={cn(
        'flex items-center justify-between bg-neutral-10 rounded-r-lg shadow-[1px_0px_2px_0px] shadow-neutral-40 p-1',
        {
          'rounded-r-none rounded-br-lg shadow-[1px_1px_2px_0px]': hasBlockLevel,
        }
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-0">
          <Select
            value={divisionId}
            onValueChange={(value) => {
              setDivisionId(value)
              setCostCodeId('')
              setCostTypeId('')
            }}
          >
            <SelectTrigger className="min-w-[110px] h-7 rounded-l text-xs px-2 py-0 rounded-r-none">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              {divisions?.map((division) => (
                <SelectItem key={division.id} value={division.id}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {divisionId && (
            <button
              type="button"
              aria-label="Clear division filter"
              className="h-7 px-2 border border-l-0 rounded-r text-neutral-400 hover:text-neutral-700 hover:bg-neutral-10"
              tabIndex={0}
              onClick={() => {
                setDivisionId('')
                setCostCodeId('')
                setCostTypeId('')
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-0">
          <Select
            value={costCodeId}
            onValueChange={(value) => {
              setCostCodeId(value)
              setCostTypeId('')
            }}
            disabled={!divisionId}
          >
            <SelectTrigger className="min-w-[110px] h-7 rounded-l text-xs px-2 py-0 rounded-r-none">
              <SelectValue placeholder="Cost code" />
            </SelectTrigger>
            <SelectContent>
              {costCodes?.map((code) => (
                <SelectItem key={code.id} value={code.id}>
                  {code.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {costCodeId && (
            <button
              type="button"
              aria-label="Clear cost code filter"
              className="h-7 px-2 border border-l-0 rounded-r text-neutral-400 hover:text-neutral-700 hover:bg-neutral-10"
              tabIndex={0}
              onClick={() => {
                setCostCodeId('')
                setCostTypeId('')
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-0">
          <Select value={costTypeId} onValueChange={setCostTypeId} disabled={!costCodeId}>
            <SelectTrigger className="min-w-[110px] h-7 rounded-l text-xs px-2 py-0 rounded-r-none">
              <SelectValue placeholder="Cost type" />
            </SelectTrigger>
            <SelectContent>
              {costTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {costTypeId && (
            <button
              type="button"
              aria-label="Clear cost type filter"
              className="h-7 px-2 border border-l-0 rounded-r text-neutral-400 hover:text-neutral-700 hover:bg-neutral-10"
              tabIndex={0}
              onClick={() => setCostTypeId('')}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      {divisionId && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-neutral-100 hover:text-neutral-140"
          onClick={resetFilters}
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </Button>
      )}
    </div>
  )
}

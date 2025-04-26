'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { FormInputText } from '@workspace/ui/components/form'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

import { CostCode, CostType, Division, useGetDivisions } from '../api'
import { useGetCostCodes } from '../api/cost-code/useGetCostCodes'
import { useGetCostTypes } from '../api/cost-type/useGetCostTypes'
import { CostNode, CostState } from '../hooks/use-cost-table/types'

interface CostTableAddModalProps {
  onAddNew: (data: {
    division: Division
    costCode: CostCode
    costType: CostType
    initialCost: number
    currentPlannedCost: number
    projectedCost: number
  }) => void
  onClose: () => void
  state: CostState
}

export function CostTableAddModal({ onAddNew, onClose, state: initialState }: CostTableAddModalProps) {
  const [stateTree] = useState(initialState.tree.filter((node) => node.id !== 'grand-total'))
  const [costCodeTrees, setCostCodeTrees] = useState<CostNode[] | undefined>(undefined)
  const [costTypeTrees, setCostTypeTrees] = useState<CostNode[] | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(true)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('')
  const [selectedCostCodeId, setSelectedCostCodeId] = useState<string>('')
  const [selectedCostTypeId, setSelectedCostTypeId] = useState<string>('')
  const [initialCost, setInitialCost] = useState(0)
  const [currentPlannedCost, setCurrentPlannedCost] = useState(0)
  const [projectedCost, setProjectedCost] = useState(0)

  const { data: divisions } = useGetDivisions()
  const { data: costCodes } = useGetCostCodes({ divisionId: selectedDivisionId })
  const { data: costTypes } = useGetCostTypes({ costCodeId: selectedCostCodeId })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const division = divisions?.find((division) => division.id === selectedDivisionId)
    const costCode = costCodes?.find((costCode) => costCode.id === selectedCostCodeId)
    const costType = costTypes?.find((costType) => costType.id === selectedCostTypeId)

    if (division && costCode && costType) {
      onAddNew({
        division,
        costCode,
        costType,
        initialCost: Number(initialCost),
        currentPlannedCost: Number(currentPlannedCost),
        projectedCost: Number(projectedCost),
      })
    }
    // Reset form
    setSelectedDivisionId('')
    setSelectedCostCodeId('')
    setSelectedCostTypeId('')
    setInitialCost(0)
    setCurrentPlannedCost(0)
    setProjectedCost(0)
    setIsOpen(false)
    onClose()
  }

  const disabled = !selectedDivisionId || !selectedCostCodeId || !selectedCostTypeId

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
        setIsOpen(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Cost Line</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Select
              value={selectedDivisionId}
              onValueChange={(value) => {
                const divisionTree = stateTree.find((node) => node.id === value)
                if (divisionTree) {
                  setCostCodeTrees(divisionTree.children)
                }
                setSelectedDivisionId(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a division" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {divisions?.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costCode">Cost Code</Label>
            <Select
              value={selectedCostCodeId}
              onValueChange={(value) => {
                setSelectedCostCodeId(value)
                setCostTypeTrees(costCodeTrees?.find((node) => node.id === value)?.children)
              }}
              disabled={!selectedDivisionId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a cost code" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {costCodes?.map((costCode) => (
                  <SelectItem key={costCode.id} value={costCode.id}>
                    {costCode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costType">Cost Type</Label>
            <Select value={selectedCostTypeId} onValueChange={setSelectedCostTypeId} disabled={!selectedCostCodeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cost type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {costTypes
                  ?.filter((costType) => !costTypeTrees?.find((node) => node.id === costType.id))
                  .map((costType) => (
                    <SelectItem key={costType.id} value={costType.id}>
                      {costType.name}
                    </SelectItem>
                  ))}
                {!costTypes?.filter((costType) => !costTypeTrees?.find((node) => node.id === costType.id)).length &&
                  selectedCostCodeId && (
                    <SelectItem disabled value="new-cost-type">
                      <span className="text-gray-500">No new cost types available</span>
                    </SelectItem>
                  )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialCost">Initial Cost</Label>
            <FormInputText
              className="w-full text-right"
              id="initialCost"
              variant="currency"
              value={initialCost}
              onChange={(value) => setInitialCost(value)}
              placeholder="Enter initial cost"
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPlannedCost">Current Planned Cost</Label>
            <FormInputText
              className="w-full text-right"
              id="currentPlannedCost"
              variant="currency"
              value={currentPlannedCost}
              onChange={(value) => setCurrentPlannedCost(value)}
              placeholder="Enter current planned cost"
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectedCost">Projected Cost</Label>
            <FormInputText
              className="w-full text-right"
              id="projectedCost"
              variant="currency"
              value={projectedCost}
              onChange={(value) => setProjectedCost(value)}
              placeholder="Enter projected cost"
              required
              disabled={disabled}
            />
          </div>

          <Button type="submit" className="w-full" disabled={disabled}>
            Confirm
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

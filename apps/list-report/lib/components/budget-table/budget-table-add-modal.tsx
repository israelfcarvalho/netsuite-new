'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { FormInputText } from '@workspace/ui/components/form'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

import { CostCode, CostType, Division, useGetDivisions } from '../../api'
import { BudgetNode, BudgetState } from './use-budget-table/types'
import { useGetCostCodes } from '../../api/cost-code/useGetCostCodes'
import { useGetCostTypes } from '../../api/cost-type/useGetCostTypes'

interface BudgetTableAddModalProps {
  onAddNew: (data: {
    division: Division
    costCode: CostCode
    costType: CostType
    originalEstimate: number
    currentEstimate: number
    projectedEstimate: number
  }) => void
  onClose: () => void
  state: BudgetState
}

export function BudgetTableAddModal({ onAddNew, onClose, state: initialState }: BudgetTableAddModalProps) {
  const [stateTree] = useState(initialState.tree.filter((node: BudgetNode) => node.id !== 'grand-total'))
  const [costCodeTrees, setCostCodeTrees] = useState<BudgetNode[] | undefined>(undefined)
  const [costTypeTrees, setCostTypeTrees] = useState<BudgetNode[] | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(true)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('')
  const [selectedCostCodeId, setSelectedCostCodeId] = useState<string>('')
  const [selectedCostTypeId, setSelectedCostTypeId] = useState<string>('')
  const [originalEstimate, setOriginalEstimate] = useState(0)
  const [currentEstimate, setCurrentEstimate] = useState(0)
  const [projectedEstimate, setProjectedEstimate] = useState(0)

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
        originalEstimate: Number(originalEstimate),
        currentEstimate: Number(currentEstimate),
        projectedEstimate: Number(projectedEstimate),
      })
    }
    // Reset form
    setSelectedDivisionId('')
    setSelectedCostCodeId('')
    setSelectedCostTypeId('')
    setOriginalEstimate(0)
    setCurrentEstimate(0)
    setProjectedEstimate(0)
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
            <Label htmlFor="originalEstimate">Original Estimate</Label>
            <FormInputText
              className="w-full text-right"
              id="originalEstimate"
              variant="currency"
              value={originalEstimate}
              onChange={(value) => setOriginalEstimate(value)}
              placeholder="Enter original estimate"
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentEstimate">Current Estimate</Label>
            <FormInputText
              className="w-full text-right"
              id="currentEstimate"
              variant="currency"
              value={currentEstimate}
              onChange={(value) => setCurrentEstimate(value)}
              placeholder="Enter current estimate"
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectedEstimate">Projected Estimate</Label>
            <FormInputText
              className="w-full text-right"
              id="projectedEstimate"
              variant="currency"
              value={projectedEstimate}
              onChange={(value) => setProjectedEstimate(value)}
              placeholder="Enter projected estimate"
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

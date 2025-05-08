import { X, RefreshCw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

import { useGetRanchBlocks, RanchBlock } from '@/lib/api/ranch-block'

interface BudgetTableBlockFiltersProps {
  onChange?: (blockChain: string) => void
}

export function BudgetTableBlockFilters({ onChange }: BudgetTableBlockFiltersProps) {
  const [blocks, setBlocks] = useState<RanchBlock[][]>([])
  const [selectedBlocks, setSelectedBlocks] = useState<RanchBlock[]>([])
  const parentId = selectedBlocks[selectedBlocks.length - 1]?.id

  const { data } = useGetRanchBlocks(parentId)

  useEffect(() => {
    const blockChain = selectedBlocks.map((b) => b.name).join(' > ')

    onChange?.(blockChain)
  }, [selectedBlocks, onChange])

  useEffect(() => {
    if (data.length > 0) {
      setBlocks((oldBlocks) => {
        return [...oldBlocks, data]
      })
    }
  }, [data])

  const handleSelect = (idx: string, blocks: RanchBlock[]) => {
    const block = blocks.find((b) => b.id === idx)
    if (block) {
      setSelectedBlocks((oldSelectedBlocks) => [...oldSelectedBlocks, block])
    }
  }

  const handleClear = (idx: number) => {
    setSelectedBlocks((oldSelectedBlocks) => oldSelectedBlocks.slice(0, idx))
    setBlocks((oldBlocks) => oldBlocks.slice(0, idx))
  }

  const handleReset = () => {
    if (selectedBlocks.length > 0) {
      setSelectedBlocks([])
      setBlocks([])
    }
  }

  return (
    <div className="flex items-center justify-between bg-neutral-10 rounded-tr-lg shadow-[1px_-1px_2px_0px] shadow-neutral-40 p-1">
      <div className="flex items-center gap-4">
        {blocks.map((block, idx) => (
          <div className="flex items-center gap-0" key={block[0]?.parent?.id}>
            <Select
              value={selectedBlocks[idx]?.id || ''}
              onValueChange={(id) => handleSelect(id, block)}
              disabled={!block}
            >
              <SelectTrigger className="min-w-[110px] h-7 rounded-l text-xs px-2 py-0 rounded-r-none">
                <SelectValue placeholder={`Block Level ${idx + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {block.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBlocks[idx]?.id && (
              <button
                type="button"
                aria-label="Clear block filter"
                className="h-7 px-2 border border-l-0 rounded-r text-neutral-400 hover:text-neutral-700 hover:bg-neutral-10"
                tabIndex={0}
                onClick={() => handleClear(idx)}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedBlocks.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-neutral-100 hover:text-neutral-140"
          onClick={handleReset}
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </Button>
      )}
    </div>
  )
}

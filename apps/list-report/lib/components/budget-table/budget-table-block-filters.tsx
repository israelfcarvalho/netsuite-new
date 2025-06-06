import { X, RefreshCw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

import { useGetRanchBlocks, RanchBlock } from '@/lib/api/ranch-block'

interface BudgetTableBlockFiltersProps {
  onChange?: (blockFilter?: BlockFilter) => void
}

export interface BlockFilter {
  name: string
  id: string
}

export function BudgetTableBlockFilters({ onChange }: BudgetTableBlockFiltersProps) {
  const [blocks, setBlocks] = useState<RanchBlock[][]>([])
  const [selectedBlocks, setSelectedBlocks] = useState<RanchBlock[]>([])
  const parentId = selectedBlocks[selectedBlocks.length - 1]?.id

  const { data } = useGetRanchBlocks(parentId)

  useEffect(() => {
    const block = selectedBlocks[selectedBlocks.length - 1]

    if (block?.id && block?.name) {
      onChange?.({ name: block.name, id: block.id })
    } else {
      onChange?.()
    }
  }, [selectedBlocks, onChange])

  useEffect(() => {
    if (data.length > 0) {
      setBlocks((oldBlocks) => {
        return [...oldBlocks, data]
      })
    }
  }, [data])

  const handleSelect = (idx: number, blocks: RanchBlock[], id: string) => {
    const block = blocks.find((b) => b.id === id)
    if (block) {
      setSelectedBlocks((oldSelectedBlocks) => {
        const newSelectedBlocks = oldSelectedBlocks.filter((_, i) => i <= idx)
        if (newSelectedBlocks[idx]?.id !== id) {
          newSelectedBlocks[idx] = block
        }

        return newSelectedBlocks
      })
      setBlocks((oldBlocks) => oldBlocks.slice(0, idx + 1))
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
          <div className="flex items-center gap-0" key={block[0]?.name}>
            <Select
              value={selectedBlocks[idx]?.id || ''}
              onValueChange={(id) => handleSelect(idx, block, id)}
              disabled={!block}
            >
              <SelectTrigger className="min-w-[110px] h-7 rounded-l text-xs px-2 py-0 rounded-r-none">
                <SelectValue placeholder="- select -" />
              </SelectTrigger>
              <SelectContent>
                {block.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name.split(':').pop()}
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

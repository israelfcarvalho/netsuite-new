'use client'

import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@workspace/ui/components/command'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { cn } from '@workspace/ui/lib/style'

import { SelectMultipleSimpleProps } from './select-multiple-simple.types'

export const SelectMultipleSimple: React.FC<SelectMultipleSimpleProps> = ({
  options,
  selectedOptions,
  label,
  onChange,
}) => {
  const mappedSelectedOptionsRef = useRef<Map<string, boolean>>(new Map())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mappedSelectedOptions: Map<string, boolean> = new Map()

    selectedOptions.forEach((option) => {
      mappedSelectedOptions.set(option.value, true)
    })

    mappedSelectedOptionsRef.current = mappedSelectedOptions
  }, [selectedOptions])

  const handleSelect = (value: string) => {
    const optionState = mappedSelectedOptionsRef.current.get(value)!
    mappedSelectedOptionsRef.current.set(value, !optionState)

    onChange(
      Array.from(mappedSelectedOptionsRef.current.entries()).reduce((acc, [value, state]) => {
        if (state) {
          acc.push(value)
        }
        return acc
      }, [] as string[])
    )
  }

  const selectedCount = selectedOptions.length
  const allSelected = selectedCount === options.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-haspopup="listbox"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'min-w-[200px] justify-between transition-all duration-200',
            'hover:border-brand-100 hover:shadow-sm',
            open && 'border-brand-100 ring-2 ring-brand-100/20 shadow-sm'
          )}
        >
          <span className="flex items-center gap-2">
            <span className="font-medium">{label}</span>

            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-brand-100 bg-brand-10 rounded-full">
              {allSelected ? 'All' : selectedCount}
            </span>
          </span>
          <ChevronDownIcon
            className={cn('h-4 w-4 shrink-0 text-neutral-100 transition-transform duration-200', {
              'transform rotate-180': open,
            })}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0 rounded-lg border border-neutral-40',
          'bg-white shadow-lg backdrop-blur-sm',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        align="start"
      >
        <Command className="relative">
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-neutral-90">No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = mappedSelectedOptionsRef.current.get(option.value) ?? false
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className={cn(
                      'relative flex items-center gap-3 px-3 py-2.5 cursor-pointer',
                      'text-sm text-neutral-180',
                      'transition-colors duration-150',
                      'hover:bg-brand-10 hover:text-neutral-200',
                      'focus:bg-brand-10 focus:text-neutral-200',
                      'aria-selected:bg-brand-10 aria-selected:text-neutral-200'
                    )}
                    aria-selected={isSelected}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center',
                        'w-4 h-4 rounded border-2 transition-all duration-200',
                        'flex-shrink-0',
                        isSelected
                          ? 'bg-brand-100 border-brand-100 shadow-sm'
                          : 'border-neutral-50 bg-white hover:border-brand-60'
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          'h-3 w-3 text-white transition-all duration-200',
                          isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        )}
                        strokeWidth={3}
                      />
                    </div>
                    <span className="flex-1 leading-tight">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

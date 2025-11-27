'use client'

import { FormControl, FormField, FormLabel } from '@radix-ui/react-form'
import { Check, ChevronDown } from 'lucide-react'
import React, { ComponentRef, KeyboardEventHandler, useEffect, useMemo, useRef, useState } from 'react'

import { useVirtualList, VirtualList, VirtualSizeProvider } from '@workspace/ui/components/virtual-list'
import { searchEngine } from '@workspace/ui/lib/search'
import { cn } from '@workspace/ui/lib/style'

import { ComboboxComponent, ComboboxOption } from './combobox.types'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from '../../command'

const ITEM_PADDING_X = 8,
  ITEM_GAP = 4,
  ICON_CHECK_SIZE = 16,
  ITEM_PADDING_Y = 4,
  ITEM_BORDER_TOP = 1

export const ComboboxFactory = <T extends ComboboxOption>(): ComboboxComponent<T> => {
  const Combobox: ComboboxComponent<T> = ({
    options: incomingOptions,
    required,
    name,
    label,
    onSelect,
    optionSelected,
    disabled,
    viewMode,
    hiddeLabel,
  }) => {
    const optionsWithUniqueId = useMemo(() => {
      const ids = new Set<string>()

      return incomingOptions.filter((option) => {
        if (ids.has(option.id)) {
          return false
        }

        ids.add(option.id)

        return true
      })
    }, [incomingOptions])

    const [optionSelectedCache, setOptionSelectedCache] = useState<typeof optionSelected>()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')
    const [search, setSearch] = React.useState('')
    const formFieldRef = useRef<ComponentRef<typeof FormField>>(null)
    const inputRef = useRef<HTMLInputElement>(document.createElement('input'))

    const options = useMemo<typeof optionsWithUniqueId>(() => {
      if (search) {
        const optionsProspect = searchEngine(optionsWithUniqueId, ['label'], search)

        return optionsProspect
      }

      const blankOption = {
        id: `${label}-${name}-blank`,
        label: 'blank',
        value: 'blank',
      } as (typeof optionsWithUniqueId)[0]

      return [blankOption, ...optionsWithUniqueId]
    }, [optionsWithUniqueId, search, label, name])

    const allListItems = useMemo(() => {
      return optionsWithUniqueId.map((option) => ({
        id: option.id,
        content: option.label,
      }))
    }, [optionsWithUniqueId])

    const currentListItems = useMemo(() => {
      return options.map((option) => ({
        id: option.id,
        content: option.label,
      }))
    }, [options])

    useEffect(() => {
      if (optionSelected) {
        setValue(optionSelected.value)
      }
    }, [optionSelected])

    useEffect(() => {
      if (!open && value && value !== search) {
        setSearch(value)
      }
    }, [open, value, search])

    const cancel = () => {
      setTimeout(() => {
        setOpen(false)
        setOptionSelectedCache(undefined)
      }, 100)
    }

    const onSearchChange = (search: string) => {
      if (!search) {
        if (optionSelected) {
          setOptionSelectedCache(optionSelected)
        }
        handleSelect(undefined)
      }

      setSearch(search)
      setOpen(true)
    }

    const handleKeyboard: KeyboardEventHandler<HTMLInputElement> = (event) => {
      if (event.key === 'Escape') {
        if (optionSelectedCache) {
          onSelect(optionSelectedCache)
        }
      }
    }

    const handleSelect = (option: typeof optionSelected) => {
      onSelect(option)
      setValue(option?.label ?? '')
      setSearch(option?.label ?? '')
      setOpen(false)
    }

    const showChevronDown = !open && !viewMode

    return (
      <VirtualSizeProvider>
        <Command shouldFilter={false} className="relative h-auto overflow-visible bg-inherit">
          <FormField ref={formFieldRef} name={name}>
            <FormLabel className={cn('font-sans text-xs text-input-label font-semibold', { hidden: !!hiddeLabel })}>
              {label}

              {required && !viewMode && <span className="ml-[2px] text-light-danger-120 text-base">*</span>}
            </FormLabel>

            <div className="w-full relative">
              <FormControl asChild>
                <CommandInput
                  disabled={viewMode || disabled}
                  ref={inputRef}
                  className={cn('bg-light-neutral border-solid border border-input-border', {
                    'disabled:cursor-default border-0 px-0 rounded-none bg-transparent': viewMode,
                  })}
                  role="combobox"
                  aria-expanded={open}
                  onValueChange={onSearchChange}
                  onFocus={() => setOpen(true)}
                  onBlur={cancel}
                  value={search}
                  onKeyDown={handleKeyboard}
                />
              </FormControl>

              {showChevronDown && (
                <ChevronDown
                  role="button"
                  aria-label={`open ${label}`}
                  onClick={() => inputRef.current?.focus()}
                  className="bg-light-neutral absolute size-6 pr-2 top-1 right-[1px] cursor-pointer"
                />
              )}
            </div>
          </FormField>
          <CommandList
            className={cn(
              '!absolute max-h-56 overflow-hidden mt-px w-full z-10 shadow-[0px_10px_20px_0px] shadow-light-neutral-60 rounded-b-md',
              !open && 'hidden'
            )}
            style={{ top: formFieldRef.current?.offsetHeight }}
          >
            <CommandEmpty>{options.length ? 'No results Found' : 'No options available'}</CommandEmpty>
            <CommandGroup>
              <VirtualList
                anchorRef={inputRef}
                allItems={allListItems}
                currentItems={currentListItems}
                filledSpace={useMemo(() => ({ width: ICON_CHECK_SIZE + ITEM_PADDING_X * 2 + ITEM_GAP }), [])}
                extraSpace={useMemo(() => ({ height: ITEM_PADDING_Y * 2 + ITEM_BORDER_TOP }), [])}
              >
                {({ style, index }) => {
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const { loading } = useVirtualList()

                  const option = options[index]
                  if (!option) return null
                  if (option.value === 'blank') {
                    return (
                      <CommandItem
                        className={cn('flex justify-between h-8')}
                        key="blank"
                        value="blank"
                        onSelect={() => handleSelect(undefined)}
                      />
                    )
                  }

                  return (
                    <CommandItem
                      className={cn('flex justify-between flex-nowrap border-solid border-light-neutral-30')}
                      key={option.id}
                      data-key={option.id}
                      value={option.value}
                      onSelect={() => handleSelect(option)}
                      style={{
                        ...style,
                        paddingLeft: ITEM_PADDING_X,
                        paddingRight: ITEM_PADDING_X,
                        columnGap: ITEM_GAP,
                        paddingBottom: ITEM_PADDING_Y,
                        paddingTop: ITEM_PADDING_Y,
                        borderTopWidth: ITEM_BORDER_TOP,
                      }}
                    >
                      <span
                        className={cn({
                          'w-full break-normal whitespace-nowrap overflow-hidden text-ellipsis': loading,
                        })}
                        style={{ wordBreak: !loading ? 'break-word' : undefined }}
                      >
                        {option.label}
                      </span>
                      <Check
                        className={cn(value === option.value ? 'opacity-100' : 'opacity-0')}
                        style={{ width: ICON_CHECK_SIZE, height: ICON_CHECK_SIZE }}
                      />
                    </CommandItem>
                  )
                }}
              </VirtualList>
            </CommandGroup>
          </CommandList>
        </Command>
      </VirtualSizeProvider>
    )
  }

  return Combobox
}

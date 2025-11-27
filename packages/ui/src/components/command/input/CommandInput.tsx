'use client'

import { CommandInput as CommandInputPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import React from 'react'

import { cn } from '@workspace/ui/lib/style'

import { CommandInputStyles } from './CommandInput.styles'
import { CommandInputProps, CommandInputRef } from './CommandInput.types'

export const CommandInput = React.forwardRef<CommandInputRef, CommandInputProps>(
  ({ className, searchIcon, ...props }, ref) => {
    const { inputSearchStyle, inputStyleVariant } = CommandInputStyles

    const inputClassName = React.useMemo(() => inputStyleVariant({ searchIcon }), [searchIcon, inputStyleVariant])

    return (
      <div className="flex items-center" data-cmdk-input-wrapper="">
        {!!searchIcon && <Search className={inputSearchStyle} />}

        <CommandInputPrimitive ref={ref} className={cn(inputClassName, className)} {...props} />
      </div>
    )
  }
)

CommandInput.displayName = CommandInputPrimitive.displayName

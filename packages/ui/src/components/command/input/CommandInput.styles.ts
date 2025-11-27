import { tv } from 'tailwind-variants'

import { cn } from '@workspace/ui/lib/style'

//netsuite className
const className = 'border-input-border border-solid border min-h-8'

const inputStyleVariant = tv({
  base: cn(
    className,
    'flex min-h-8 w-full rounded-md py-0 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
  ),
  variants: {
    searchIcon: {
      true: '',
      false: 'px-2',
    },
  },
})

const inputSearchStyle = 'mr-2 h-4 w-4 shrink-0 opacity-50'

export const CommandInputStyles = {
  inputStyleVariant,
  inputSearchStyle,
}

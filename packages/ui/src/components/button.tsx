import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@workspace/ui/lib/style'

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-brand-100 focus-visible:ring-brand-100/50 focus-visible:ring-[3px] aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red",
  {
    variants: {
      variant: {
        default: 'bg-brand-100 text-white shadow-xs hover:bg-brand-110',
        destructive:
          'bg-red text-white shadow-xs hover:bg-oracle focus-visible:ring-red/20 dark:focus-visible:ring-red/40',
        outline: 'border border-neutral-50 bg-white shadow-xs hover:bg-neutral-20 hover:text-neutral-180',
        secondary: 'bg-neutral-20 text-neutral-180 shadow-xs hover:bg-neutral-30',
        ghost: 'inherit hover:text-neutral-130 hover',
        link: 'text-brand-100 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button }

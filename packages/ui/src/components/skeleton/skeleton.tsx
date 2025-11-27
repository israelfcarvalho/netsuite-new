import { cn } from '@workspace/ui/lib/style'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn('bg-neutral-50 animate-pulse rounded-md', className)} {...props} />
}

export { Skeleton }

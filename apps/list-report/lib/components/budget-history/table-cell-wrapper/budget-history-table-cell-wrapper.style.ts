import { cn } from '@workspace/ui/lib/style'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepStyle = <T extends Record<string, unknown>>(style: (...params: any[]) => string, nestedStyle: T) => {
  return Object.assign(style, nestedStyle)
}

export const styles = {
  container: deepStyle((className?: string) => cn('relative group', 'flex items-center justify-between', className), {
    button: deepStyle(() => cn('invisible group-hover:visible'), {
      icon: cn('size-4'),
    }),
  }),
}

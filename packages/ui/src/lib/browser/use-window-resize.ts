import { useEffect, useState } from 'react'

/**
 * A hook that tracks window resize events and returns whether the window is currently being resized.
 * Uses a debounce to determine when resizing has stopped.
 * @param debounceMs - The number of milliseconds to wait before considering the resize complete
 * @returns {boolean} isResizing - Whether the window is currently being resized
 */
export function useWindowResize(debounceMs: number = 150) {
  const [isResizing, setIsResizing] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  useEffect(() => {
    const handleResizeStart = () => {
      setIsResizing(true)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    const handleResizeEnd = () => {
      const id = setTimeout(() => {
        setIsResizing(false)
      }, debounceMs)
      setTimeoutId(id)
    }

    window.addEventListener('resize', handleResizeStart)
    window.addEventListener('resize', handleResizeEnd)

    return () => {
      window.removeEventListener('resize', handleResizeStart)
      window.removeEventListener('resize', handleResizeEnd)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [debounceMs, timeoutId])

  return { isResizing }
}

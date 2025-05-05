import { useSearchParams as useSearchParamsNext } from 'next/navigation'
import { useMemo } from 'react'

type SearchParamsType = 'boolean' | 'string'

const booleanMap: Record<string, boolean> = {
  true: true,
  false: false,
}

export const useSearchParams = (type: SearchParamsType) => {
  const searchParamsNext = useSearchParamsNext()

  const searchParamsBoolean = useMemo(() => {
    function get(key: string) {
      const result = searchParamsNext.get(key) ?? ''

      return booleanMap[result]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { get: _, ...otherProps } = searchParamsNext

    return {
      ...otherProps,
      get,
    }
  }, [searchParamsNext])

  const searchParams = {
    boolean: searchParamsBoolean,
    string: searchParamsNext,
  }

  return searchParams[type]
}

import { ReadonlyURLSearchParams, useSearchParams as useSearchParamsNext } from 'next/navigation'
import { useMemo } from 'react'

import { isNotNumericRegex } from '../numbers'

type SearchParamsType = 'boolean' | 'string' | 'number'

type SearchParamsReturn<T extends SearchParamsType> = Omit<ReadonlyURLSearchParams, 'get'> & {
  get: (key: string) => T extends 'boolean' ? boolean : T extends 'string' ? string | null : number | null
}

const booleanMap: Record<string, boolean> = {
  true: true,
  false: false,
}

export const useSearchParams = <T extends SearchParamsType>(type: T): SearchParamsReturn<T> => {
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

  const searchParamsNumber = useMemo(() => {
    function get(key: string) {
      const rawParam = searchParamsNext.get(key)

      if (rawParam === null) return null

      if (!isNotNumericRegex.test(rawParam)) return null

      return Number(rawParam)
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
    number: searchParamsNumber,
  }

  //TODO: imporve typing around this to not need this alias
  return searchParams[type] as SearchParamsReturn<T>
}

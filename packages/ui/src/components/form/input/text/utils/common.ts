import { formatNumber, FormatNumberOptions } from '@workspace/ui/lib/numbers'

export const NON_NUMERIC_CHARS_REGEX = /[^0-9]/g
export const NUMERIC_CHARS_REGEX = /[0-9]/g

export const defaultCurrencyOptions: FormatNumberOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  minimumIntegerDigits: 1,
}

export const formatCurrency = (value?: number, options?: FormatNumberOptions): string => {
  return formatNumber(value, {
    ...defaultCurrencyOptions,
    ...options,
  })
}

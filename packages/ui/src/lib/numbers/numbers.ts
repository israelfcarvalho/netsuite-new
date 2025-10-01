import { FormatNumberOptions } from './numbers.types'

export const isNotNumericRegex = /^-?\d*\.?\d+$/

export function formatNumber(value: number, options: FormatNumberOptions = {}) {
  const { locales = 'en-US', ...restOptions } = options

  return Intl.NumberFormat(locales, restOptions).format(value)
}

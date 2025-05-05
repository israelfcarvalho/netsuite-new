import { FormInputTextCurrencyProps } from '../text.types'
import { FormInputTextStateManager } from '../text.types'
import { defaultCurrencyOptions, NON_NUMERIC_CHARS_REGEX } from './common'
import { updateCursorPosition } from './currency.cursor'

const normalizeCurrency = (value: string) => {
  value = value.padStart(4, '0')
  const decimalPart = value.slice(-2)
  const integerPart = value.slice(0, -2)

  value = `${integerPart}.${decimalPart}`

  return value
}

const parseCurrencyLength = (value: string) => {
  if (value.length > 10) {
    return value.slice(0, 10)
  }

  return value
}

const parseCurrencyWhenPrevValueIsZero = (value: string, prevValue: string) => {
  const prevValueNumber = Number(prevValue)
  const prevValueIsZero = prevValueNumber === 0

  if (prevValueIsZero) {
    let moveRight = false

    do {
      const lastCharIndex = value.length - 1
      const lastChar = value[lastCharIndex]
      const lastCharIsZero = lastChar === '0'

      moveRight = value.length > 0 && lastCharIsZero

      if (moveRight) {
        value = value.slice(0, lastCharIndex)
      }
    } while (moveRight)
  }

  return value
}

export const changeCurrency = (
  input: HTMLInputElement,
  props: FormInputTextCurrencyProps,
  stateManager: FormInputTextStateManager
) => {
  const { onChange, value } = props
  const minimumFractionDigits = props.options?.minimumFractionDigits ?? defaultCurrencyOptions.minimumFractionDigits
  const prevValue = value.toFixed(minimumFractionDigits)

  let numericValue = input.value.replace(NON_NUMERIC_CHARS_REGEX, '')
  numericValue = parseCurrencyWhenPrevValueIsZero(numericValue, prevValue)
  numericValue = parseCurrencyLength(numericValue)
  const newValue = normalizeCurrency(numericValue)

  onChange(Number(newValue))
  updateCursorPosition(input, prevValue, newValue, stateManager, props.options ?? defaultCurrencyOptions)
}

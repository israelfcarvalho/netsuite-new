import { FormatNumberOptions } from '@workspace/ui/lib/numbers'

import { FormInputTextStateManager } from '../text.types'
import { defaultCurrencyOptions, formatCurrency, NUMERIC_CHARS_REGEX } from './common'

const shouldMoveCursorToEnd = (
  newValueNumber: number,
  prevValueNumber: number,
  valueSelectedNumber: number
): boolean => {
  return !newValueNumber || prevValueNumber === 0 || valueSelectedNumber === prevValueNumber
}

const findFirstNumericPosition = (formattedValue: string): number => {
  for (let i = 0; i < formattedValue.length; i++) {
    const isNumber = !isNaN(Number(formattedValue[i]))
    if (isNumber) {
      return i
    }
  }
  return 0
}

const calculateNonNumericCharsDifference = (newValue: string, prevValue: string): number => {
  const newValueNoNumberChars = newValue.replace(NUMERIC_CHARS_REGEX, '')
  const prevValueNoNumberChars = prevValue.replace(NUMERIC_CHARS_REGEX, '')
  return newValueNoNumberChars.length - prevValueNoNumberChars.length
}

const handleCursorPositionForAdding = (
  newValueFormatted: string,
  prevValueFormatted: string,
  prevCursorPosition: number | undefined,
  currentCursorPosition: number,
  normalizedCursorPosition: number
): number => {
  if (prevValueFormatted.length === newValueFormatted.length && prevCursorPosition !== undefined) {
    const charsSkipped = newValueFormatted.slice(prevCursorPosition, currentCursorPosition)
    const isSkippedCharNumber = !isNaN(Number(charsSkipped))

    if (!isSkippedCharNumber) {
      return normalizedCursorPosition + 1
    }
  }

  const cursorCorrection = calculateNonNumericCharsDifference(newValueFormatted, prevValueFormatted)
  return normalizedCursorPosition + cursorCorrection
}

const handleCursorPositionForDeleting = (
  newValueFormatted: string,
  prevValueFormatted: string,
  prevCursorPosition: number | undefined,
  normalizedCursorPosition: number
): number => {
  if (prevCursorPosition === undefined) {
    return normalizedCursorPosition
  }

  const isDeletingFromEnd = prevCursorPosition === prevValueFormatted.length

  if (isDeletingFromEnd) {
    return newValueFormatted.length
  }

  if (prevValueFormatted.length === newValueFormatted.length) {
    const charsSkipped = newValueFormatted.slice(prevCursorPosition, normalizedCursorPosition)
    const isSkippedCharNumber = !isNaN(Number(charsSkipped))

    if (isSkippedCharNumber) {
      return prevCursorPosition
    }
  }
  const cursorCorrection = calculateNonNumericCharsDifference(prevValueFormatted, newValueFormatted)
  return normalizedCursorPosition - cursorCorrection
}

const calculateCursorPosition = (
  prevValue: string,
  newValue: string,
  input: HTMLInputElement,
  state: FormInputTextStateManager['state'],
  formatOptions: FormatNumberOptions = defaultCurrencyOptions
): number => {
  const { currentSelectionRange, prevCursorPosition } = state

  const newValueNumber = Number(newValue)
  const newValueFormatted = formatCurrency(newValueNumber, formatOptions)
  const prevValueNumber = Number(prevValue)
  const prevValueFormatted = formatCurrency(prevValueNumber, formatOptions)
  const valueSelected = prevValueFormatted.slice(currentSelectionRange.start, currentSelectionRange.end)
  const valueSelectedNumber = Number(valueSelected)

  if (shouldMoveCursorToEnd(newValueNumber, prevValueNumber, valueSelectedNumber)) {
    return newValueFormatted.length
  }

  const currentCursorPosition = input.selectionStart ?? input.value.length
  const normalizedCursorPosition = input.selectionStart ?? input.value.length

  if (normalizedCursorPosition === 0) {
    return findFirstNumericPosition(newValueFormatted)
  }

  const isAddingValue =
    newValueFormatted.length > prevValueFormatted.length ||
    (prevCursorPosition && currentCursorPosition > prevCursorPosition)

  if (isAddingValue) {
    return handleCursorPositionForAdding(
      newValueFormatted,
      prevValueFormatted,
      prevCursorPosition,
      currentCursorPosition,
      normalizedCursorPosition
    )
  }

  const isDeletingValue =
    newValueFormatted.length < prevValueFormatted.length ||
    (prevCursorPosition && currentCursorPosition < prevCursorPosition)

  if (isDeletingValue) {
    return handleCursorPositionForDeleting(
      newValueFormatted,
      prevValueFormatted,
      prevCursorPosition,
      normalizedCursorPosition
    )
  }

  return normalizedCursorPosition
}

export const updateCursorPosition = (
  input: HTMLInputElement,
  prevValue: string,
  newValue: string,
  stateManager: FormInputTextStateManager,
  formatOptions: FormatNumberOptions = defaultCurrencyOptions
): void => {
  const cursorPosition = calculateCursorPosition(prevValue, newValue, input, stateManager.state, formatOptions)

  requestAnimationFrame(() => {
    input.setSelectionRange(cursorPosition, cursorPosition)
    stateManager.setState((prevState) => ({
      ...prevState,
      prevCursorPosition: cursorPosition,
    }))
  })
}

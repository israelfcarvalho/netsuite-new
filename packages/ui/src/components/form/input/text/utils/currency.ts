import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react'

import { FormInputTextCurrencyProps, FormInputTextStateManager } from '../text.types'
import { changeCurrency } from './currency.change'

export const handleChangeCurrency =
  (props: FormInputTextCurrencyProps, stateManager: FormInputTextStateManager) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget

    changeCurrency(input, props, stateManager)
    stateManager.setState((prevState) => ({
      ...prevState,
      currentSelectionRange: {
        start: 0,
        end: 0,
      },
    }))
  }

export const handleKeyDownCurrency = (e: KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9]/.test(e.key) &&
    e.key !== 'Backspace' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    e.key !== 'ArrowUp' &&
    e.key !== 'ArrowDown' &&
    e.key !== 'Delete' &&
    e.key !== 'Enter' &&
    e.key !== 'Tab'
  ) {
    e.preventDefault()
  }
}

export const handleSelectCurrency =
  (stateManager: FormInputTextStateManager) => (event: React.MouseEvent<HTMLInputElement>) => {
    const selectionStart = event.currentTarget.selectionStart ?? 0
    const selectionEnd = event.currentTarget.selectionEnd ?? 0

    stateManager.setState((prevState) => ({
      ...prevState,
      currentSelectionRange: {
        start: selectionStart,
        end: selectionEnd,
      },
    }))
  }

export const handleKeyUpCurrency =
  (stateManager: FormInputTextStateManager) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown'
    ) {
      const prevCursorPosition = event.currentTarget.selectionStart ?? 0

      stateManager.setState((prevState) => ({
        ...prevState,
        prevCursorPosition,
      }))
    }
  }

export const handleClickCurrency =
  (stateManager: FormInputTextStateManager) => (event: MouseEvent<HTMLInputElement>) => {
    const currentCursorPosition = event.currentTarget.selectionStart ?? 0
    stateManager.setState((prevState) => ({
      ...prevState,
      prevCursorPosition: currentCursorPosition,
    }))
  }

import { ChangeEvent, KeyboardEvent } from 'react'

import {
  CurrencyInputOptions,
  FormInputTextCurrencyProps,
  FormInputTextNormalProps,
  FormInputTextProps,
} from './text.types'

const defaultCurrencyOptions: CurrencyInputOptions = {
  locales: 'en-US',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  minimumIntegerDigits: 1,
}

const formatCurrency = (amount: number, options?: CurrencyInputOptions): string => {
  const { locales = 'en-US', ...restOptions } = options || {}
  const mergedOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    ...defaultCurrencyOptions,
    ...restOptions,
  }

  return Intl.NumberFormat(locales, mergedOptions).format(amount)
}

const changeCurrency = (onChange: FormInputTextCurrencyProps['onChange']) => (e: ChangeEvent<HTMLInputElement>) => {
  const numericValue = e.target.value.replace(/[^0-9]/g, '')
  const nonEmptyValue = numericValue.padStart(4, '0')
  const formattedValue = `${nonEmptyValue.slice(0, -2)}.${nonEmptyValue.slice(-2)}`
  onChange(Number(formattedValue))
}

const keyDownCurrency = (e: KeyboardEvent<HTMLInputElement>) => {
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

const currency = {
  format: formatCurrency,
  handleChange: changeCurrency,
  handleKeyDown: keyDownCurrency,
}

const normal = {
  format: (value: string) => value,
  handleChange: (onChange: FormInputTextNormalProps['onChange']) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value),
  handleKeyDown: undefined,
}

const handlers = {
  currency,
  normal,
}

export const getInputHandlers = (props: FormInputTextProps) => {
  switch (props.variant) {
    case 'currency':
      return {
        format: () => handlers[props.variant].format(props.value, props.options),
        handleChange: handlers[props.variant].handleChange(props.onChange),
        handleKeyDown: handlers[props.variant].handleKeyDown,
      }
    case 'normal':
      return {
        format: () => handlers[props.variant].format(props.value),
        handleChange: handlers[props.variant].handleChange(props.onChange),
        handleKeyDown: handlers[props.variant].handleKeyDown,
      }
  }
}

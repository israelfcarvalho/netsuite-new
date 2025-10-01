import { Dispatch, SetStateAction } from 'react'

import { FormatNumberOptions } from '../../../../lib/numbers'

export interface FormInputTextBaseProps {
  id?: string
  required?: boolean
  className?: string
  placeholder?: string
  disabled?: boolean
  changeOnBlur?: boolean
}

export interface FormInputTextNormalProps extends FormInputTextBaseProps {
  variant: 'normal'
  value?: string
  initialValue?: string
  onChange: (value: string) => void
}

export interface FormInputTextCurrencyProps extends FormInputTextBaseProps {
  variant: 'currency'
  value?: number
  initialValue?: number
  onChange: (value: number) => void
  options?: FormatNumberOptions
}

export type FormInputTextProps = FormInputTextNormalProps | FormInputTextCurrencyProps
export type FormInputTextVariant = FormInputTextProps['variant']

interface FormInputTextSelectionRange {
  start: number
  end: number
}

export interface FormInputTextStateManager {
  state: {
    currentSelectionRange: FormInputTextSelectionRange
    prevCursorPosition?: number
  }
  setState: Dispatch<SetStateAction<FormInputTextStateManager['state']>>
}

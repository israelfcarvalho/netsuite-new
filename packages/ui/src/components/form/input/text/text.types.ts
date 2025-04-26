export interface FormInputTextBaseProps {
  id?: string
  required?: boolean
  className?: string
  placeholder?: string
  disabled?: boolean
}

export interface FormInputTextNormalProps extends FormInputTextBaseProps {
  variant: 'normal'
  value: string
  onChange: (value: string) => void
}

export interface CurrencyInputOptions extends Omit<Intl.NumberFormatOptions, 'style'> {
  locales?: 'en-US' | 'pt-BR'
}

export interface FormInputTextCurrencyProps extends FormInputTextBaseProps {
  variant: 'currency'
  value: number
  onChange: (value: number) => void
  options?: CurrencyInputOptions
}

export type FormInputTextProps = FormInputTextNormalProps | FormInputTextCurrencyProps
export type FormInputTextVariant = FormInputTextProps['variant']

export interface Option {
  value: string
  label: string
}

export interface SelectMultipleSimpleProps {
  options: Option[]
  label: string
  onChange: (value: string[]) => void
  selectedOptions: Option[]
}

import { Input } from '../input'
import { FormInputTextProps } from './text.types'
import { getInputHandlers } from './text.utils'

export function FormInputText(props: FormInputTextProps) {
  const handlers = getInputHandlers(props)

  return (
    <Input
      className={`w-full ${props.className}`}
      id={props.id}
      type="text"
      value={handlers.format()}
      onChange={handlers.handleChange}
      onKeyDown={handlers.handleKeyDown}
      placeholder={props.placeholder}
      required={props.required}
      disabled={props.disabled}
    />
  )
}

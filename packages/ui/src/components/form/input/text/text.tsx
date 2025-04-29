import { useRef } from 'react'

import { Input } from '../input'
import { FormInputTextProps } from './text.types'
import { getInputHandlers } from './text.utils'

export function FormInputText(props: FormInputTextProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handlers = getInputHandlers(props, inputRef)

  return (
    <Input
      ref={inputRef}
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

import { useState } from 'react'

import { Input } from '../input'
import { FormInputTextProps, FormInputTextStateManager } from './text.types'
import { getInputHandlers } from './text.utils'

export function FormInputText(props: FormInputTextProps) {
  const [state, setState] = useState<FormInputTextStateManager['state']>({
    currentSelectionRange: {
      start: 0,
      end: 0,
    },
    prevCursorPosition: 0,
  })

  const handlers = getInputHandlers(props, { state, setState })

  return (
    <Input
      className={`w-full ${props.className}`}
      id={props.id}
      type="text"
      value={handlers.format()}
      onChange={handlers.handleChange}
      onKeyDown={handlers.handleKeyDown}
      onKeyUp={handlers.handleKeyUp}
      placeholder={props.placeholder}
      required={props.required}
      disabled={props.disabled}
      onSelect={handlers.handleSelect}
      onClick={handlers.handleClick}
    />
  )
}

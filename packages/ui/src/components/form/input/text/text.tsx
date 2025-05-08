import { KeyboardEvent, useState } from 'react'

import { Input } from '../input'
import { FormInputTextProps, FormInputTextStateManager } from './text.types'
import { getInputHandlers } from './text.utils'

export function FormInputText(props: FormInputTextProps) {
  const _props = { ...props }
  const { onChange: onChangeOriginal, value: valueOriginal } = props
  const [valueLocal, setValueLocal] = useState(valueOriginal)
  const [state, setState] = useState<FormInputTextStateManager['state']>({
    currentSelectionRange: {
      start: 0,
      end: 0,
    },
    prevCursorPosition: 0,
  })

  const onChangeLocal = (value: string) => {
    setValueLocal(value)
  }

  const onBlur = () => {
    if (props.changeOnBlur) {
      onChangeOriginal(valueLocal as never)
    }
  }

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (props.changeOnBlur && e.key === 'Enter') {
      onChangeOriginal(valueLocal as never)
    }
    handlers.handleKeyUp?.(e)
  }

  if (props.changeOnBlur) {
    _props.onChange = onChangeLocal
    _props.value = valueLocal
  }

  const handlers = getInputHandlers(_props, { state, setState })

  return (
    <Input
      className={`w-full ${props.className}`}
      id={props.id}
      type="text"
      value={handlers.format()}
      onChange={handlers.handleChange}
      onKeyDown={handlers.handleKeyDown}
      onKeyUp={onKeyUp}
      placeholder={props.placeholder}
      required={props.required}
      disabled={props.disabled}
      onSelect={handlers.handleSelect}
      onClick={handlers.handleClick}
      onBlur={onBlur}
    />
  )
}

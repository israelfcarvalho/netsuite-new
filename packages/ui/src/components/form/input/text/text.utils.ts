import { ChangeEvent } from 'react'

import { FormInputTextNormalProps, FormInputTextProps, FormInputTextStateManager } from './text.types'
import {
  handleChangeCurrency,
  handleClickCurrency,
  handleKeyDownCurrency,
  handleKeyUpCurrency,
  handleSelectCurrency,
  formatCurrency,
} from './utils'

const currency = {
  format: formatCurrency,
  handleChange: handleChangeCurrency,
  handleKeyDown: handleKeyDownCurrency,
  handleSelect: handleSelectCurrency,
  handleKeyUp: handleKeyUpCurrency,
  handleClick: handleClickCurrency,
}

const normal = {
  format: (value?: string) => value,
  handleChange: (onChange: FormInputTextNormalProps['onChange']) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value),
}

const handlers = {
  currency,
  normal,
}

export const getInputHandlers = (props: FormInputTextProps, stateManager: FormInputTextStateManager) => {
  switch (props.variant) {
    case 'currency':
      return {
        format: () => handlers[props.variant].format(props.value, props.options),
        handleChange: handlers[props.variant].handleChange(props, stateManager),
        handleKeyDown: handlers[props.variant].handleKeyDown,
        handleSelect: handlers[props.variant].handleSelect(stateManager),
        handleKeyUp: handlers[props.variant].handleKeyUp(stateManager),
        handleClick: handlers[props.variant].handleClick(stateManager),
      }
    case 'normal':
      return {
        format: () => handlers[props.variant].format(props.value),
        handleChange: handlers[props.variant].handleChange(props.onChange),
      }
  }
}

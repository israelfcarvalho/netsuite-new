import React from 'react'

import { formatCurrency } from './utils'

export const CurrencyCell = ({ value }: { value: number }): React.ReactElement => (
  <div className="text-right">{formatCurrency(value)}</div>
)

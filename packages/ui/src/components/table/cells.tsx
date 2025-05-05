import React from 'react'

import { formatNumber } from '@workspace/ui/lib/numbers'

export const CurrencyCell = ({ value }: { value: number }): React.ReactElement => (
  <div className="text-right">{formatNumber(value)}</div>
)

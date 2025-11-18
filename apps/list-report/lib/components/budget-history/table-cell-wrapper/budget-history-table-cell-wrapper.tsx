import { History } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

import { styles } from './budget-history-table-cell-wrapper.style'
import { BudgetHistoryTableCellWrapperProps } from './budget-history-table-cell-wrapper.type'

export function BudgetHistoryTableCellWrapper({ children, className, name }: BudgetHistoryTableCellWrapperProps) {
  return (
    <div className={styles.container(className)}>
      <Button title={`View ${name} history`} className={styles.container.button()} variant="ghost" size="icon">
        <History className={styles.container.button.icon} />
      </Button>
      {children}
    </div>
  )
}

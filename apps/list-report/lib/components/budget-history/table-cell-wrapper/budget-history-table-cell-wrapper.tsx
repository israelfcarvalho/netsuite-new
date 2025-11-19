import { History } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { useSearchParams } from '@workspace/ui/lib/navigation'

import { styles } from './budget-history-table-cell-wrapper.style'
import { BudgetHistoryTableCellWrapperProps } from './budget-history-table-cell-wrapper.type'
import { useBudgetTableContext } from '../../budget-table/use-budget-table/context/budget-table-context'

import { useGetCropPlanLinesHistory } from '@/lib/api/crop-plan/use-crop-plan-lines'

export function BudgetHistoryTableCellWrapper({
  children,
  className,
  name,
  onClick,
  lineId,
  rowId,
  hasBlockLevel,
}: BudgetHistoryTableCellWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)
  const queryParams = useSearchParams('number')
  const cropPlanId = queryParams.get('cropPlanId')

  const { history } = useGetCropPlanLinesHistory({
    lineId,
    cropPlanId: Number(cropPlanId),
    enabled: isHovered,
    action: hasBlockLevel ? 'by-ranch' : 'main',
  })

  const { updateLocalHistory } = useBudgetTableContext()

  useEffect(() => {
    if (history) {
      setIsHovered(false)
      updateLocalHistory({ type: 'remote', rowId, data: history })
    }
  }, [history, updateLocalHistory, name, rowId, lineId])

  const onHistoryHover = () => {
    setIsHovered(true)
  }

  return (
    <div className={styles.container(className)} onMouseOver={onHistoryHover}>
      <Button
        onClick={onClick}
        title={`View ${name} history`}
        className={styles.container.button()}
        variant="ghost"
        size="icon"
      >
        <History className={styles.container.button.icon} />
      </Button>
      {children}
    </div>
  )
}

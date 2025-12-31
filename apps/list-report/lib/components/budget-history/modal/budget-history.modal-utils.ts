import { HistoryItemData } from './budget-history-modal.types'
import { useBudgetTableContext } from '../../budget-table/use-budget-table/context/budget-table-context'
import { BudgedHistoryDataName } from '../../budget-table/use-budget-table/types'

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

export function calculateChange(previous: number, current: number): { value: number; isPositive: boolean } {
  const change = current - previous
  return {
    value: Math.abs(change),
    isPositive: change >= 0,
  }
}

export function getRelatedField(field: BudgedHistoryDataName): BudgedHistoryDataName | null {
  const fieldMap: Record<string, BudgedHistoryDataName> = {
    originalEstimatePerAcre: 'originalEstimate',
    originalEstimate: 'originalEstimatePerAcre',
    currentEstimatePerAcre: 'currentEstimate',
    currentEstimate: 'currentEstimatePerAcre',
  }
  return fieldMap[field] || null
}

export function getFieldHistoryData(
  rowId: string,
  field: BudgedHistoryDataName,
  state: ReturnType<typeof useBudgetTableContext>['state']
): HistoryItemData[] {
  const localHistory = state.history.local?.[rowId]?.[field]
  const remoteHistory = state.history.remote?.[rowId]?.[field]
  const items: HistoryItemData[] = []

  if (localHistory) {
    items.push({
      previousValue: localHistory.data.previousValue,
      currentValue: localHistory.data.currentValue,
      comment: localHistory.data.comment,
      isLocal: true,
      isLatest: true,
    })
  }

  if (remoteHistory?.data) {
    remoteHistory.data.forEach((item, index) => {
      items.push({
        previousValue: item.previousValue,
        currentValue: item.currentValue,
        comment: item.comment,
        date: item.date,
        user: remoteHistory.user,
        isLocal: false,
        isLatest: index === 0 && !localHistory,
      })
    })
  }

  return items
}

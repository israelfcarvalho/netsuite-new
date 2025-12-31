import { KeyboardEventHandler } from 'react'

import { BudgedHistoryDataName } from '../../budget-table/use-budget-table/types'

export type HistoryViewMode = 'combined' | 'overlapping'

export interface BudgetHistoryModalProps {
  rowId: string
  onClose: () => void
  field: BudgedHistoryDataName
}

export interface HistoryItemData {
  previousValue: number
  currentValue: number
  comment?: string
  date?: string
  user?: string
  isLocal: boolean
  isLatest: boolean
}

export interface HistoryCardProps {
  historyItem: HistoryItemData
  fieldName: string
  localComment?: string
  onCommentChange?: (value: string) => void
  onCommentBlur?: () => void
  onCommentKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>
  showRelatedField?: boolean
  relatedFieldName?: string
  relatedPreviousValue?: number
  relatedCurrentValue?: number
}

export interface CombinedHistoryViewProps {
  primaryHistory: HistoryItemData[]
  primaryField: BudgedHistoryDataName
  relatedHistory: HistoryItemData[]
  relatedField: BudgedHistoryDataName | null
  localComment: string
  onCommentChange: (value: string) => void
  onCommentBlur: () => void
  onCommentKeyDown: KeyboardEventHandler<HTMLTextAreaElement>
}

export interface OverlappingHistoryViewProps {
  primaryHistory: HistoryItemData[]
  primaryField: BudgedHistoryDataName
  relatedHistory: HistoryItemData[]
  relatedField: BudgedHistoryDataName | null
  localComment: string
  onCommentChange: (value: string) => void
  onCommentBlur: () => void
  onCommentKeyDown: KeyboardEventHandler<HTMLTextAreaElement>
}

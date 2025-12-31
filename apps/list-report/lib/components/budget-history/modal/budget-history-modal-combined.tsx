import { HistoryCard } from './budget-history-modal-card'
import { CombinedHistoryViewProps } from './budget-history-modal.types'

import { CropPlanKeysToNames } from '@/lib/utils/crop-plan/crop-plan'

export function CombinedHistoryView({
  primaryHistory,
  primaryField,
  relatedHistory,
  relatedField,
  localComment,
  onCommentChange,
  onCommentBlur,
  onCommentKeyDown,
}: CombinedHistoryViewProps) {
  if (primaryHistory.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-neutral-120 bg-neutral-10 rounded-lg border border-neutral-40">
        No history entries found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {primaryHistory.map((item, index) => {
        // Find corresponding related history item (by matching index or date)
        const relatedItem = relatedHistory[index] || relatedHistory.find((r) => r.date === item.date) || null

        return (
          <HistoryCard
            key={`primary-${index}`}
            historyItem={item}
            fieldName={CropPlanKeysToNames[primaryField].join(' ')}
            localComment={localComment}
            onCommentChange={onCommentChange}
            onCommentBlur={onCommentBlur}
            onCommentKeyDown={onCommentKeyDown}
            showRelatedField={!!relatedField && !!relatedItem}
            relatedFieldName={relatedField ? CropPlanKeysToNames[relatedField].join(' ') : undefined}
            relatedPreviousValue={relatedItem?.previousValue}
            relatedCurrentValue={relatedItem?.currentValue}
          />
        )
      })}
    </div>
  )
}

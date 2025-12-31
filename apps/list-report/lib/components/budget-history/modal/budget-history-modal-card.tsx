import { formatCurrency } from '@workspace/ui/components/form'

import { HistoryCardProps } from './budget-history-modal.types'
import { calculateChange, formatDate } from './budget-history.modal-utils'

export function HistoryCard({
  historyItem,
  fieldName,
  localComment,
  onCommentChange,
  onCommentBlur,
  onCommentKeyDown,
  showRelatedField = false,
  relatedFieldName,
  relatedPreviousValue,
  relatedCurrentValue,
}: HistoryCardProps) {
  const change = calculateChange(historyItem.previousValue, historyItem.currentValue)
  const relatedChange =
    showRelatedField && relatedPreviousValue !== undefined && relatedCurrentValue !== undefined
      ? calculateChange(relatedPreviousValue, relatedCurrentValue)
      : null

  return (
    <div
      className={`
          relative rounded-lg border transition-all
          ${historyItem.isLatest ? 'border-brand-100 bg-brand-10/30 shadow-sm' : 'border-neutral-40 bg-neutral-10'}
          ${!historyItem.isLatest && 'hover:border-neutral-60 hover:bg-neutral-20'}
        `}
    >
      {historyItem.isLatest && (
        <div className="absolute -top-2 left-4">
          <span className="bg-brand-100 text-white text-xs font-medium px-2 py-0.5 rounded-full">Latest</span>
        </div>
      )}
      {historyItem.isLocal && (
        <div className="absolute -top-2 right-4">
          <span className="bg-warning-100 text-white text-xs font-medium px-2 py-0.5 rounded-full">Not saved yet</span>
        </div>
      )}
      <div className="p-4 space-y-3">
        {!historyItem.isLocal && historyItem.date && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-neutral-100 uppercase tracking-wide">
                {formatDate(historyItem.date)}
              </div>
              {historyItem.comment && <div className="h-1 w-1 rounded-full bg-neutral-100" />}
            </div>
            {historyItem.user && <div className="text-xs text-neutral-120">by {historyItem.user}</div>}
          </div>
        )}

        <div className="space-y-4">
          {/* Primary Field */}
          <div>
            <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide mb-2">{fieldName}</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide">Previous Value</div>
                <div className="text-base font-semibold text-neutral-140">
                  {formatCurrency(historyItem.previousValue)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide">Current Value</div>
                <div className="text-base font-semibold text-brand-100">{formatCurrency(historyItem.currentValue)}</div>
              </div>
            </div>
            {change.value > 0 && (
              <div className="flex items-center gap-2 pt-2 mt-2 border-t border-neutral-40">
                <div className={`text-sm font-medium ${change.isPositive ? 'text-success-100' : 'text-danger-100'}`}>
                  {change.isPositive ? '↑' : '↓'} {formatCurrency(change.value)}
                </div>
                <div className="text-xs text-neutral-120">
                  ({change.isPositive ? '+' : '-'}
                  {((change.value / historyItem.previousValue) * 100).toFixed(1)}%)
                </div>
              </div>
            )}
          </div>

          {/* Related Field */}
          {showRelatedField &&
            relatedFieldName &&
            relatedPreviousValue !== undefined &&
            relatedCurrentValue !== undefined && (
              <div className="pt-3 border-t border-neutral-40">
                <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide mb-2">
                  {relatedFieldName}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide">Previous Value</div>
                    <div className="text-base font-semibold text-neutral-140">
                      {formatCurrency(relatedPreviousValue)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide">Current Value</div>
                    <div className="text-base font-semibold text-brand-100">{formatCurrency(relatedCurrentValue)}</div>
                  </div>
                </div>
                {relatedChange && relatedChange.value > 0 && (
                  <div className="flex items-center gap-2 pt-2 mt-2 border-t border-neutral-40">
                    <div
                      className={`text-sm font-medium ${relatedChange.isPositive ? 'text-success-100' : 'text-danger-100'}`}
                    >
                      {relatedChange.isPositive ? '↑' : '↓'} {formatCurrency(relatedChange.value)}
                    </div>
                    <div className="text-xs text-neutral-120">
                      ({relatedChange.isPositive ? '+' : '-'}
                      {((relatedChange.value / relatedPreviousValue) * 100).toFixed(1)}%)
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>

        <div className="pt-2 border-t border-neutral-40">
          <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide mb-1">Comment</div>
          {historyItem.isLocal ? (
            <textarea
              value={localComment || ''}
              onChange={(e) => onCommentChange?.(e.target.value)}
              placeholder="Add a comment..."
              className="w-full min-h-[80px] text-sm text-neutral-140 bg-neutral-20 rounded-md p-2 border border-neutral-40 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-transparent resize-none"
              onBlur={onCommentBlur}
              onKeyDown={onCommentKeyDown}
            />
          ) : (
            historyItem.comment && (
              <div className="text-sm text-neutral-140 bg-neutral-20 rounded-md p-2">{historyItem.comment}</div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

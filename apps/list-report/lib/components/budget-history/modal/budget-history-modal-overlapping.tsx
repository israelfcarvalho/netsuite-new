import { useState } from 'react'

import { HistoryCard } from './budget-history-modal-card'
import { OverlappingHistoryViewProps } from './budget-history-modal.types'
import { BudgedHistoryDataName } from '../../budget-table/use-budget-table/types'

import { CropPlanKeysToNames } from '@/lib/utils/crop-plan/crop-plan'

export function OverlappingHistoryView({
  primaryHistory,
  primaryField,
  relatedHistory,
  relatedField,
  localComment,
  onCommentChange,
  onCommentBlur,
  onCommentKeyDown,
}: OverlappingHistoryViewProps) {
  // Track which field is highlighted for each history entry independently
  const [highlightedFields, setHighlightedFields] = useState<Map<number, BudgedHistoryDataName>>(new Map())

  if (primaryHistory.length === 0 && relatedHistory.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-neutral-120 bg-neutral-10 rounded-lg border border-neutral-40">
        No history entries found
      </div>
    )
  }

  const toggleField = (index: number, field: BudgedHistoryDataName) => {
    setHighlightedFields((prev) => {
      const newMap = new Map(prev)
      const current = newMap.get(index)
      // Toggle: if clicking the same field, keep it highlighted; otherwise switch
      newMap.set(index, current === field ? field : field)
      return newMap
    })
  }

  return (
    <div className="space-y-4">
      {primaryHistory.map((primaryHistoryItem, primaryHistoryIndex) => {
        const relatedHistoryItem = relatedHistory[primaryHistoryIndex]
        const highlightedField = highlightedFields.get(primaryHistoryIndex) || primaryField // Default to primary field
        const isPrimaryHighlighted = highlightedField === primaryField
        const isRelatedHighlighted = highlightedField === relatedField
        const hasRelatedCard =
          relatedHistoryItem || (relatedField && primaryHistoryIndex === 0 && relatedHistory.length === 0)

        // If no related card, show primary card normally (not overlapping)
        if (!hasRelatedCard || !relatedField) {
          return primaryHistoryItem ? (
            <HistoryCard
              key={`primary-only-${primaryHistoryIndex}`}
              historyItem={primaryHistoryItem}
              fieldName={CropPlanKeysToNames[primaryField].join(' ')}
              localComment={localComment}
              onCommentChange={onCommentChange}
              onCommentBlur={onCommentBlur}
              onCommentKeyDown={onCommentKeyDown}
            />
          ) : null
        }

        return (
          <div key={`overlap-${primaryHistoryIndex}`} className="relative min-h-[200px]">
            {primaryHistoryItem && (
              <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-white rounded-md border border-neutral-40 shadow-sm p-1">
                <button
                  onClick={() => toggleField(primaryHistoryIndex, primaryField)}
                  className={`
                      px-2 py-1 text-xs font-medium rounded transition-all
                      ${isPrimaryHighlighted ? 'bg-brand-100 text-white' : 'bg-transparent text-neutral-120 hover:bg-neutral-20'}
                    `}
                  title={CropPlanKeysToNames[primaryField].join(' ')}
                >
                  {CropPlanKeysToNames[primaryField].join(' ')}
                </button>
                <div className="h-4 w-px bg-neutral-40" />
                <button
                  onClick={() => toggleField(primaryHistoryIndex, relatedField)}
                  className={`
                      px-2 py-1 text-xs font-medium rounded transition-all
                      ${isRelatedHighlighted ? 'bg-brand-100 text-white' : 'bg-transparent text-neutral-120 hover:bg-neutral-20'}
                    `}
                  title={CropPlanKeysToNames[relatedField].join(' ')}
                >
                  {CropPlanKeysToNames[relatedField].join(' ')}
                </button>
              </div>
            )}

            {primaryHistoryItem && (
              <div
                className={`
                    rounded-lg border transition-all
                    ${isPrimaryHighlighted ? 'border-brand-100 bg-brand-10/30 shadow-lg z-10 opacity-100' : 'border-neutral-40 bg-neutral-10 z-0 opacity-0 pointer-events-none'}
                  `}
              >
                <HistoryCard
                  historyItem={primaryHistoryItem}
                  fieldName={CropPlanKeysToNames[primaryField].join(' ')}
                  localComment={localComment}
                  onCommentChange={onCommentChange}
                  onCommentBlur={onCommentBlur}
                  onCommentKeyDown={onCommentKeyDown}
                />
              </div>
            )}

            {relatedField && (
              <div
                className={`
                    absolute inset-0 rounded-lg border transition-all
                    ${isRelatedHighlighted ? 'border-brand-100 bg-brand-10/30 shadow-lg z-10 opacity-100' : 'border-neutral-40 bg-neutral-10 z-0 opacity-0 pointer-events-none'}
                  `}
              >
                {relatedHistoryItem ? (
                  <HistoryCard
                    historyItem={relatedHistoryItem}
                    fieldName={CropPlanKeysToNames[relatedField].join(' ')}
                    localComment={localComment}
                    onCommentChange={onCommentChange}
                    onCommentBlur={onCommentBlur}
                    onCommentKeyDown={onCommentKeyDown}
                  />
                ) : (
                  <div className="p-4">
                    <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide mb-2">
                      {CropPlanKeysToNames[relatedField].join(' ')}
                    </div>
                    <div className="text-sm text-neutral-120 italic">No history available</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

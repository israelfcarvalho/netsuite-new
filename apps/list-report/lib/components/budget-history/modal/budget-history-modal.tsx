import { ChevronsRight } from 'lucide-react'
import { useState, useEffect, KeyboardEventHandler } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { useSearchParams } from '@workspace/ui/lib/navigation'

import { CombinedHistoryView } from './budget-history-modal-combined'
import { OverlappingHistoryView } from './budget-history-modal-overlapping'
import { BudgetHistoryModalProps, HistoryViewMode } from './budget-history-modal.types'
import { getFieldHistoryData, getRelatedField } from './budget-history.modal-utils'
import { useBudgetTableContext } from '../../budget-table/use-budget-table/context/budget-table-context'

import { CropPlanKeysToNames } from '@/lib/utils/crop-plan/crop-plan'

export function BudgetHistoryModal({ rowId, onClose, field }: BudgetHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [localComment, setLocalComment] = useState('')

  const queryParams = useSearchParams('string')
  const viewMode = queryParams.get('viewMode') as HistoryViewMode
  const { state, updateLocalHistory } = useBudgetTableContext()

  const rowName = state.nodes.get(rowId)?.name
  const currentNode = state.nodes.get(rowId)
  const relatedField = getRelatedField(field)

  const primaryHistory = getFieldHistoryData(rowId, field, state)
  const relatedHistory = relatedField ? getFieldHistoryData(rowId, relatedField, state) : []

  const localHistoryPrimary = state.history.local?.[rowId]?.[field]
  const localHistoryRelated = relatedField ? state.history.local?.[rowId]?.[relatedField] : undefined

  useEffect(() => {
    if (localHistoryPrimary?.data.comment) {
      setLocalComment(localHistoryPrimary.data.comment)
    }
  }, [localHistoryPrimary?.data.comment])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
    setIsOpen(open)
  }

  const handleCommentChange = (value: string) => {
    setLocalComment(value)
  }

  const saveComment = () => {
    if (localHistoryPrimary && currentNode) {
      updateLocalHistory({
        type: 'local',
        lineId: localHistoryPrimary.id,
        rowId,
        name: field,
        newValue: currentNode[field],
        comment: localComment,
      })
    }

    if (localHistoryRelated && currentNode && relatedField) {
      updateLocalHistory({
        type: 'local',
        lineId: localHistoryRelated.id,
        rowId,
        name: relatedField,
        newValue: currentNode[relatedField],
        comment: localComment,
      })
    }
  }

  const handleBlur = () => {
    saveComment()
  }

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      saveComment()
    }
  }

  const hasHistory = primaryHistory.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col">
        <DialogHeader className="border-b border-neutral-40 pb-4">
          <DialogTitle className="text-brand-100 text-2xl font-bold">History</DialogTitle>
          <DialogDescription className="mt-2 flex items-center gap-2 text-neutral-120">
            <span className="font-semibold text-neutral-140">{rowName}</span>
            <span className="text-neutral-100">
              <ChevronsRight className="w-4 h-4" />
            </span>
            <span className="font-semibold text-neutral-140">{CropPlanKeysToNames[field].join(' ')}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {hasHistory || relatedHistory.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-brand-100" />
                <h3 className="text-lg font-semibold text-neutral-140">Details</h3>
              </div>
              {viewMode === 'combined' ? (
                <CombinedHistoryView
                  primaryHistory={primaryHistory}
                  primaryField={field}
                  relatedHistory={relatedHistory}
                  relatedField={relatedField}
                  localComment={localComment}
                  onCommentChange={handleCommentChange}
                  onCommentBlur={handleBlur}
                  onCommentKeyDown={handleKeyDown}
                />
              ) : (
                <OverlappingHistoryView
                  primaryHistory={primaryHistory}
                  primaryField={field}
                  relatedHistory={relatedHistory}
                  relatedField={relatedField}
                  localComment={localComment}
                  onCommentChange={handleCommentChange}
                  onCommentBlur={handleBlur}
                  onCommentKeyDown={handleKeyDown}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-neutral-120">No history found</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

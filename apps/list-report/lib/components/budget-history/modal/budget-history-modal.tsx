import { ChevronsRight } from 'lucide-react'
import { useState, useMemo, useEffect, KeyboardEventHandler } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { formatCurrency } from '@workspace/ui/components/form/input/text'

import { BudgetHistoryModalProps } from './budget-history-modal.types'
import { useBudgetTableContext } from '../../budget-table/use-budget-table/context/budget-table-context'

import { CropPlanKeysToNames } from '@/lib/utils/crop-plan/crop-plan'

function formatDate(dateString: string): string {
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

function calculateChange(previous: number, current: number): { value: number; isPositive: boolean } {
  const change = current - previous
  return {
    value: Math.abs(change),
    isPositive: change >= 0,
  }
}

export function BudgetHistoryModal({ rowId, onClose, field }: BudgetHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [localComment, setLocalComment] = useState('')

  const { state, updateLocalHistory } = useBudgetTableContext()

  const localHistory = state.history.local?.[rowId]?.[field]
  const remoteHistory = state.history.remote?.[rowId]?.[field]
  const rowName = state.nodes.get(rowId)?.name
  const currentNode = state.nodes.get(rowId)

  // Initialize local comment from existing local history
  useEffect(() => {
    if (localHistory?.data.comment) {
      setLocalComment(localHistory.data.comment)
    }
  }, [localHistory?.data.comment])

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
    if (localHistory && currentNode) {
      updateLocalHistory({
        type: 'local',
        lineId: localHistory.id,
        rowId,
        name: field,
        newValue: currentNode[field],
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

  // Merge local and remote history, with local first when it exists
  const allHistoryItems = useMemo(() => {
    const items: Array<{
      type: 'local' | 'remote'
      localData?: typeof localHistory
      remoteDataItem?: { date: string; previousValue: number; currentValue: number; comment?: string }
      remoteUser?: string
      index: number
    }> = []

    if (localHistory) {
      items.push({ type: 'local', localData: localHistory, index: 0 })
    }

    if (remoteHistory?.data) {
      remoteHistory.data.forEach((item, index) => {
        items.push({
          type: 'remote',
          remoteDataItem: item,
          remoteUser: remoteHistory.user,
          index,
        })
      })
    }

    return items
  }, [localHistory, remoteHistory])

  const hasHistory = !!localHistory || !!remoteHistory

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col">
        <DialogHeader className="border-b border-neutral-40 pb-4">
          <DialogTitle className="text-brand-100 text-2xl font-bold">History</DialogTitle>
          <DialogDescription className="mt-2">
            <div className="flex items-center gap-2 text-neutral-120">
              <span className="font-semibold text-neutral-140">{rowName}</span>
              <span className="text-neutral-100">
                <ChevronsRight className="w-4 h-4" />
              </span>
              <span className="font-semibold text-neutral-140">{CropPlanKeysToNames[field].join(' ')}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className=" space-y-6 flex-1 overflow-y-auto">
          {hasHistory ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-brand-100" />
                <h3 className="text-lg font-semibold text-neutral-140">Details</h3>
              </div>
              <div className="space-y-3">
                {allHistoryItems.length > 0 ? (
                  allHistoryItems.map((historyItem, globalIndex) => {
                    const isLocal = historyItem.type === 'local'
                    const isLatest = globalIndex === 0

                    if (isLocal && !historyItem.localData) return null
                    if (!isLocal && !historyItem.remoteDataItem) return null

                    const previousValue = isLocal
                      ? historyItem.localData!.data.previousValue
                      : historyItem.remoteDataItem!.previousValue
                    const currentValue = isLocal
                      ? historyItem.localData!.data.currentValue
                      : historyItem.remoteDataItem!.currentValue
                    const comment = isLocal ? historyItem.localData!.data.comment : historyItem.remoteDataItem!.comment
                    const date = isLocal ? undefined : historyItem.remoteDataItem!.date
                    const user = isLocal ? undefined : historyItem.remoteUser

                    const change = calculateChange(previousValue, currentValue)

                    return (
                      <div
                        key={`${historyItem.type}-${globalIndex}`}
                        className={`
                          relative rounded-lg border transition-all
                          ${isLatest ? 'border-brand-100 bg-brand-10/30 shadow-sm' : 'border-neutral-40 bg-neutral-10'}
                          ${!isLatest && 'hover:border-neutral-60 hover:bg-neutral-20'}
                        `}
                      >
                        {isLatest && (
                          <div className="absolute -top-2 left-4">
                            <span className="bg-brand-100 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              Latest
                            </span>
                          </div>
                        )}
                        {isLocal && (
                          <div className="absolute -top-2 right-4">
                            <span className="bg-warning-100 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              Not saved yet
                            </span>
                          </div>
                        )}
                        <div className="p-4 space-y-3">
                          {!isLocal && date && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="text-xs font-medium text-neutral-100 uppercase tracking-wide">
                                  {formatDate(date)}
                                </div>
                                {comment && <div className="h-1 w-1 rounded-full bg-neutral-100" />}
                              </div>
                              {user && <div className="text-xs text-neutral-120">by {user}</div>}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide">
                                Previous Value
                              </div>
                              <div className="text-base font-semibold text-neutral-140">
                                {formatCurrency(previousValue)}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide">
                                Current Value
                              </div>
                              <div className="text-base font-semibold text-brand-100">
                                {formatCurrency(currentValue)}
                              </div>
                            </div>
                          </div>

                          {change.value > 0 && (
                            <div className="flex items-center gap-2 pt-2 border-t border-neutral-40">
                              <div
                                className={`
                                  text-sm font-medium
                                  ${change.isPositive ? 'text-success-100' : 'text-danger-100'}
                                `}
                              >
                                {change.isPositive ? '↑' : '↓'} {formatCurrency(change.value)}
                              </div>
                              <div className="text-xs text-neutral-120">
                                ({change.isPositive ? '+' : '-'}
                                {((change.value / previousValue) * 100).toFixed(1)}%)
                              </div>
                            </div>
                          )}

                          <div className="pt-2 border-t border-neutral-40">
                            <div className="text-xs font-medium text-neutral-120 uppercase tracking-wide mb-1">
                              Comment
                            </div>
                            {isLocal ? (
                              <textarea
                                value={localComment}
                                onChange={(e) => handleCommentChange(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full min-h-[80px] text-sm text-neutral-140 bg-neutral-20 rounded-md p-2 border border-neutral-40 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-transparent resize-none"
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                              />
                            ) : (
                              comment && (
                                <div className="text-sm text-neutral-140 bg-neutral-20 rounded-md p-2">{comment}</div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-sm text-neutral-120 bg-neutral-10 rounded-lg border border-neutral-40">
                    No history entries found
                  </div>
                )}
              </div>
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

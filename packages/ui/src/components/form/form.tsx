'use client'

import { Form as FormPrimitive } from '@radix-ui/react-form'
import React, { FormEventHandler, useCallback, PropsWithChildren } from 'react'

import { cn } from '@workspace/ui/lib/style'

import { FormProps } from './form.types'
import { Button } from '../button'

const headerAndContentSyncSpaceClassName = '@2xl:px-10 px-4'

export const DefaultForm: React.FC<FormProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
  submitLabel = 'Save',
  contentClassname,
  logo,
  actions,
}) => {
  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      onSubmit?.(event)
    },
    [onSubmit]
  )

  const actionColumns = () => {
    let count = actions?.length ?? 0

    if (onSubmit) {
      count++
    }

    return Array.from({ length: count }, (_, i) => (i + 1 < count ? 'auto' : '1fr')).join(' ')
  }

  return (
    <FormPrimitive className="@container flex flex-col w-full @ h-full bg-light-neutral-00" onSubmit={handleSubmit}>
      <div
        className={cn(
          headerAndContentSyncSpaceClassName,
          'py-4 bg-light-neutral-30 shadow-lg z-10',
          'grid grid-flow-col grid-rows-[repeat(2,minmax(0,auto))] items-center'
        )}
      >
        <div>
          {!!title && <h2 className="text-xl font-bold">{title}</h2>}

          {!!subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div
          className={cn(!!title || !!subtitle ? 'mt-3' : '', 'grid gap-x-4 grid-rows-1')}
          style={{ gridTemplateColumns: actionColumns() }}
        >
          {!!onSubmit && (
            <Button className="w-fit" type="submit">
              {submitLabel}
            </Button>
          )}

          {actions?.map((action) => (
            <Button
              className={cn('w-fit', {
                'justify-self-end': action.align === 'end',
              })}
              key={action.id}
              variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
        {!!logo && <div className="justify-self-end h-14 row-span-2">{logo}</div>}
      </div>

      <div
        className={cn(
          'flex-1 overflow-auto',
          'px-6 pt-4 pb-8 bg-light-neutral-10',
          headerAndContentSyncSpaceClassName,
          contentClassname
        )}
      >
        {children}
      </div>
    </FormPrimitive>
  )
}

export const Form: React.FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <FormPrimitive className={cn(className)}>{children}</FormPrimitive>
}

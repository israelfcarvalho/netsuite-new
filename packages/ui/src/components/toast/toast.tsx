'use client'

import * as ToastPrimitives from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '../../lib/style'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 right-0 z-[var(--z-index-growl-panel)] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = tv({
  base: 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  variants: {
    variant: {
      default:
        'border-neutral-50 bg-white text-neutral-180 shadow-sm dark:border-neutral-20 dark:bg-neutral-10 dark:text-neutral-190',
      destructive: 'border-danger-100 bg-danger-30 text-danger-100 shadow-sm dark:border-danger-90 dark:bg-danger-90',
      success: 'border-success-100 bg-success-20 text-success-100 shadow-sm dark:border-success-90 dark:bg-success-90',
      warning: 'border-warning-100 bg-warning text-white shadow-sm dark:border-warning-90 dark:bg-warning-90',
      info: 'border-info-100 bg-info-100 text-white shadow-sm dark:border-info-90 dark:bg-info-90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Toast = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: keyof typeof toastVariants.variants.variant
  }
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-neutral-50 bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-neutral-20 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-danger/30 group-[.destructive]:hover:bg-danger group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-danger dark:border-neutral-20 dark:hover:bg-neutral-30 dark:group-[.destructive]:border-danger-90/40 dark:group-[.destructive]:hover:border-danger-80/30 dark:group-[.destructive]:hover:bg-danger-80',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'cursor-pointer absolute right-2 top-2 rounded-md p-1 text-neutral-120 opacity-0 transition-opacity hover:text-neutral-180 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-white/70 group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-danger group-[.destructive]:focus:ring-offset-danger dark:text-neutral-110 dark:hover:text-neutral-190 dark:group-[.destructive]:text-white/70 dark:group-[.destructive]:hover:text-white',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('text-sm text-neutral-120', className)} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

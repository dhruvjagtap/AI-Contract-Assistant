import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-600',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warn-50 text-warn-700',
        danger: 'bg-danger-50 text-danger-600',
        brand: 'bg-brand-50 text-brand-700',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  const dotColor = {
    neutral: 'bg-ink-400',
    success: 'bg-success-500',
    warning: 'bg-warn-500',
    danger: 'bg-danger-500',
    brand: 'bg-brand-500',
  }[variant ?? 'neutral']

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />}
      {children}
    </span>
  )
}

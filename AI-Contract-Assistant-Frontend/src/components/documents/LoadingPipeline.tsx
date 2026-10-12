import { Check, Loader2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProcessingStep } from '@/types'

export function LoadingPipeline({ steps }: { steps: ProcessingStep[] }) {
  return (
    <ol className="space-y-1">
      {steps.map((step, idx) => (
        <li key={step.id} className="flex items-center gap-3 py-1.5">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                step.status === 'complete' && 'bg-success-500 text-white',
                step.status === 'active' && 'bg-brand-50 text-brand-600',
                step.status === 'pending' && 'bg-ink-100 text-ink-300'
              )}
            >
              {step.status === 'complete' && <Check className="h-3 w-3" strokeWidth={3} />}
              {step.status === 'active' && <Loader2 className="h-3 w-3 animate-spin" />}
              {step.status === 'pending' && <Circle className="h-2 w-2 fill-current" />}
            </span>
            {idx < steps.length - 1 && (
              <span
                className={cn(
                  'h-4 w-px',
                  step.status === 'complete' ? 'bg-success-500' : 'bg-ink-200'
                )}
              />
            )}
          </div>
          <span
            className={cn(
              'text-sm',
              step.status === 'pending' ? 'text-ink-400' : 'text-ink-800',
              step.status === 'active' && 'font-medium'
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  )
}

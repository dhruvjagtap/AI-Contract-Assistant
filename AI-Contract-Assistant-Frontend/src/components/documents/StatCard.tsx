import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: 'neutral' | 'success' | 'warning' | 'brand'
}) {
  const toneStyles = {
    neutral: 'bg-ink-50 text-ink-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warn-50 text-warn-600',
    brand: 'bg-brand-50 text-brand-600',
  }[tone]

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneStyles)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">{value}</p>
    </Card>
  )
}

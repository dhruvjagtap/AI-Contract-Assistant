import * as Icons from 'lucide-react'
import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { SummaryField } from '@/types'

export function SummaryCard({ field }: { field: SummaryField }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[field.icon] ?? FileText

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-ink-500">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-xs font-medium uppercase tracking-wide">{field.label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-ink-900">{field.value}</p>
    </Card>
  )
}

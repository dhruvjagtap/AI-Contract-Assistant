import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from './StatusBadge'
import { formatRelativeDate } from '@/lib/utils'
import type { ContractDocument } from '@/types'

export function DocumentCard({ document }: { document: ContractDocument }) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/documents/${document.id}`)}
      className="flex cursor-pointer items-center gap-4 p-4 transition-shadow hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/documents/${document.id}`)}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
        <FileText className="h-5 w-5 text-brand-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">{document.name}</p>
        <p className="truncate text-xs text-ink-500">
          {document.contractType} · {formatRelativeDate(document.uploadedAt)}
        </p>
      </div>
      <StatusBadge status={document.status} />
    </Card>
  )
}

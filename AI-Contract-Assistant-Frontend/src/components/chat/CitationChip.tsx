import { Quote } from 'lucide-react'
import type { Citation } from '@/types'

export function CitationChip({ citation, onClick }: { citation: Citation; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
    >
      <Quote className="h-3 w-3" />
      Page {citation.page} · {citation.section.split('—')[0].trim()}
    </button>
  )
}

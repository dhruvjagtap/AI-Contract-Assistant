import { Drawer, DrawerContent } from '@/components/ui/Drawer'
import { FileText } from 'lucide-react'
import type { Citation } from '@/types'

export function SourceDrawer({
  citation,
  documentName,
  open,
  onOpenChange,
}: {
  citation: Citation | null
  documentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {citation && (
        <DrawerContent title={documentName} subtitle={`Page ${citation.page}`}>
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2.5">
            <FileText className="h-4 w-4 text-ink-400" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink-700">{citation.section}</p>
            </div>
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            Cited passage
          </p>
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-[15px] leading-relaxed text-ink-800">
              <mark className="rounded bg-warn-50 px-0.5 text-ink-900 decoration-clone">
                {citation.excerpt}
              </mark>
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-ink-100 bg-ink-50/60 p-3.5">
            <p className="text-xs leading-relaxed text-ink-500">
              This excerpt was retrieved directly from page {citation.page} of the source document
              and matched against your question using semantic search over the document's indexed
              chunks.
            </p>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  )
}

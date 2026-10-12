import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Loader2, CheckCircle2, MessageSquare, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatCard } from '@/components/documents/StatCard'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { documentService } from '@/services/documentService'
import type { ContractDocument } from '@/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<ContractDocument[] | null>(null)

  useEffect(() => {
    documentService.list().then(setDocuments)
  }, [])

  const total = documents?.length ?? 0
  const ready = documents?.filter((d) => d.status === 'ready').length ?? 0
  const processing = documents?.filter((d) => d.status === 'processing').length ?? 0
  const totalQuestions = documents?.reduce((sum, d) => sum + d.questionCount, 0) ?? 0

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">
            Overview of your contracts and AI-assisted review activity.
          </p>
        </div>
        <Button variant="brand" onClick={() => navigate('/documents')}>
          <Upload className="h-4 w-4" />
          Upload contract
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {documents === null ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[100px] rounded-xl" />)
        ) : (
          <>
            <StatCard label="Total Documents" value={total} icon={FileText} tone="brand" />
            <StatCard label="Ready" value={ready} icon={CheckCircle2} tone="success" />
            <StatCard label="Processing" value={processing} icon={Loader2} tone="warning" />
            <StatCard label="Total Questions" value={totalQuestions} icon={MessageSquare} tone="neutral" />
          </>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Recent documents</h2>
          <button
            onClick={() => navigate('/documents')}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>

        {documents === null ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[68px] rounded-xl" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload your first contract to get started with AI-assisted review."
            action={
              <Button variant="brand" onClick={() => navigate('/documents')}>
                <Upload className="h-4 w-4" />
                Upload contract
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 5).map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

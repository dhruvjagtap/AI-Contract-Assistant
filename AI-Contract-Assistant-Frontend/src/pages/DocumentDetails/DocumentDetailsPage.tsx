import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Trash2,
  FileText,
  Layers,
  Clock,
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { SummaryCard } from "@/components/documents/SummaryCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";

import { documentService } from "@/services/documentService";

import { formatRelativeDate, formatFileSize } from "@/lib/utils";

import type { ContractDocument, SummaryField, RecentQuestion } from "@/types";

export function DocumentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doc, setDoc] = useState<ContractDocument | null | undefined>(
    undefined,
  );

  const [summary, setSummary] = useState<SummaryField[]>([]);
  const [questions, setQuestions] = useState<RecentQuestion[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    documentService.getById(id).then((document) => setDoc(document ?? null));

    documentService.getSummary(id).then(setSummary);
    documentService.getRecentQuestions(id).then(setQuestions);
  }, [id]);

  if (doc === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (doc === null) {
    return (
      <EmptyState
        icon={FileText}
        title="Document not found"
        description="This document may have been deleted or the link is incorrect."
        action={
          <Button variant="secondary" onClick={() => navigate("/documents")}>
            Back to documents
          </Button>
        }
      />
    );
  }

  const handleDelete = async () => {
    try {
      await documentService.delete(doc.id);

      setDeleteOpen(false);

      toast({
        title: "Document deleted",
        description: `${doc.name} was removed.`,
        variant: "success",
      });

      navigate("/documents");
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete the document.",
        variant: "error",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate("/documents")}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Documents
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50">
            <FileText className="h-5 w-5 text-brand-600" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-ink-900">
                {doc.name}
              </h1>

              <StatusBadge status={doc.status} />
            </div>

            <p className="mt-1 text-sm text-ink-500">{doc.contractType}</p>
          </div>
        </div>

        {doc.status === "ready" && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="brand"
              onClick={() => navigate(`/chat?doc=${doc.id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              Open Chat
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                document
                  .getElementById("summary-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Sparkles className="h-4 w-4" />
              Summarize
            </Button>

            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <Layers className="h-4 w-4 text-ink-400" />

          <div>
            <p className="text-xs text-ink-500">Pages</p>

            <p className="text-sm font-semibold text-ink-900">{doc.pages}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <Layers className="h-4 w-4 text-ink-400" />

          <div>
            <p className="text-xs text-ink-500">Chunks</p>

            <p className="text-sm font-semibold text-ink-900">
              {doc.status === "ready" ? doc.chunks : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <Clock className="h-4 w-4 text-ink-400" />

          <div>
            <p className="text-xs text-ink-500">Upload time</p>

            <p className="text-sm font-semibold text-ink-900">
              {formatRelativeDate(doc.uploadedAt)}
            </p>
          </div>
        </Card>
      </div>

      {doc.status === "processing" && (
        <Card className="mt-6 p-6">
          <p className="mb-1 text-sm font-semibold text-ink-900">
            Processing document
          </p>

          <p className="text-xs text-ink-500">
            {formatFileSize(doc.sizeBytes)} · Your document is being processed.
          </p>
        </Card>
      )}

      {doc.status === "failed" && (
        <Card className="mt-6 p-6">
          <EmptyState
            icon={FileText}
            title="Processing failed"
            description="We couldn't process this document. Try re-uploading the file."
            action={
              <Button
                variant="secondary"
                onClick={() => navigate("/documents")}
              >
                Back to documents
              </Button>
            }
          />
        </Card>
      )}

      {doc.status === "ready" && (
        <>
          <div id="summary-section" className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">
              Key information
            </h2>

            {summary.length === 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {summary.map((field) => (
                  <SummaryCard key={field.label} field={field} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">
              Recent activity
            </h2>

            {questions.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="No questions yet"
                description="Open the AI chat to start asking questions about this contract."
                action={
                  <Button
                    variant="brand"
                    onClick={() => navigate(`/chat?doc=${doc.id}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Open Chat
                  </Button>
                }
              />
            ) : (
              <Card className="divide-y divide-ink-100">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <HelpCircle className="h-4 w-4 shrink-0 text-ink-400" />

                    <p className="flex-1 text-sm text-ink-800">{q.question}</p>

                    <span className="shrink-0 text-xs text-ink-400">
                      {formatRelativeDate(q.askedAt)}
                    </span>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent title="Delete document">
          <p className="text-sm text-ink-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-ink-900">{doc.name}</span>? This
            action cannot be undone.
          </p>

          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import {
//   ArrowLeft,
//   MessageSquare,
//   Sparkles,
//   Trash2,
//   FileText,
//   Layers,
//   Clock,
//   HelpCircle,
// } from 'lucide-react'
// import { Button } from '@/components/ui/Button'
// import { Card } from '@/components/ui/Card'
// import { StatusBadge } from '@/components/documents/StatusBadge'
// import { SummaryCard } from '@/components/documents/SummaryCard'
// import { LoadingPipeline } from '@/components/documents/LoadingPipeline'
// import { Skeleton } from '@/components/ui/Skeleton'
// import { EmptyState } from '@/components/ui/EmptyState'
// import { Dialog, DialogContent } from '@/components/ui/Dialog'
// import { useToast } from '@/components/ui/Toast'
// import { documentService } from '@/services/documentService'
// import { formatRelativeDate, formatFileSize } from '@/lib/utils'
// import { processingPipeline } from '@/mock/data'
// import type { ContractDocument, SummaryField, RecentQuestion, ProcessingStep } from '@/types'

// export function DocumentDetailsPage() {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const { toast } = useToast()

//   const [doc, setDoc] = useState<ContractDocument | null | undefined>(undefined)
//   const [summary, setSummary] = useState<SummaryField[]>([])
//   const [questions, setQuestions] = useState<RecentQuestion[]>([])
//   const [pipeline, setPipeline] = useState<ProcessingStep[]>(processingPipeline)
//   const [deleteOpen, setDeleteOpen] = useState(false)

//   useEffect(() => {
//     if (!id) return
//     documentService.getById(id).then((d) => setDoc(d ?? null))
//     documentService.getSummary(id).then(setSummary)
//     documentService.getRecentQuestions(id).then(setQuestions)
//   }, [id])

//   // Simulate live pipeline progress for processing documents
//   useEffect(() => {
//     if (doc?.status !== 'processing') return
//     const order: ProcessingStep['id'][] = ['upload', 'read', 'extract', 'chunk', 'embed', 'index']
//     let activeIdx = order.indexOf('chunk')

//     const interval = setInterval(() => {
//       activeIdx += 1
//       if (activeIdx >= order.length) {
//         clearInterval(interval)
//         setDoc((prev) => (prev ? { ...prev, status: 'ready' } : prev))
//         return
//       }
//       setPipeline(
//         order.map((stepId, idx) => ({
//           id: stepId,
//           label: processingPipeline.find((s) => s.id === stepId)!.label,
//           status: idx < activeIdx ? 'complete' : idx === activeIdx ? 'active' : 'pending',
//         }))
//       )
//     }, 1400)

//     return () => clearInterval(interval)
//   }, [doc?.status])

//   if (doc === undefined) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-8 w-1/3" />
//         <Skeleton className="h-40 rounded-xl" />
//       </div>
//     )
//   }

//   if (doc === null) {
//     return (
//       <EmptyState
//         icon={FileText}
//         title="Document not found"
//         description="This document may have been deleted or the link is incorrect."
//         action={
//           <Button variant="secondary" onClick={() => navigate('/documents')}>
//             Back to documents
//           </Button>
//         }
//       />
//     )
//   }

//   const handleDelete = () => {
//     setDeleteOpen(false)
//     toast({ title: 'Document deleted', description: `${doc.name} was removed.`, variant: 'info' })
//     navigate('/documents')
//   }

//   return (
//     <div className="animate-fade-in">
//       <button
//         onClick={() => navigate('/documents')}
//         className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
//       >
//         <ArrowLeft className="h-3.5 w-3.5" />
//         Documents
//       </button>

//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//         <div className="flex items-start gap-3">
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50">
//             <FileText className="h-5 w-5 text-brand-600" />
//           </div>
//           <div>
//             <div className="flex flex-wrap items-center gap-2">
//               <h1 className="text-xl font-semibold tracking-tight text-ink-900">{doc.name}</h1>
//               <StatusBadge status={doc.status} />
//             </div>
//             <p className="mt-1 text-sm text-ink-500">{doc.contractType}</p>
//           </div>
//         </div>

//         {doc.status === 'ready' && (
//           <div className="flex flex-wrap gap-2">
//             <Button variant="brand" onClick={() => navigate(`/chat?doc=${doc.id}`)}>
//               <MessageSquare className="h-4 w-4" />
//               Open Chat
//             </Button>
//             <Button variant="secondary" onClick={() => document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' })}>
//               <Sparkles className="h-4 w-4" />
//               Summarize
//             </Button>
//             <Button variant="danger" onClick={() => setDeleteOpen(true)}>
//               <Trash2 className="h-4 w-4" />
//               Delete
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <Card className="flex items-center gap-3 p-4">
//           <Layers className="h-4 w-4 text-ink-400" />
//           <div>
//             <p className="text-xs text-ink-500">Pages</p>
//             <p className="text-sm font-semibold text-ink-900">{doc.pages}</p>
//           </div>
//         </Card>
//         <Card className="flex items-center gap-3 p-4">
//           <Layers className="h-4 w-4 text-ink-400" />
//           <div>
//             <p className="text-xs text-ink-500">Chunks</p>
//             <p className="text-sm font-semibold text-ink-900">{doc.status === 'ready' ? doc.chunks : '—'}</p>
//           </div>
//         </Card>
//         <Card className="flex items-center gap-3 p-4">
//           <Clock className="h-4 w-4 text-ink-400" />
//           <div>
//             <p className="text-xs text-ink-500">Upload time</p>
//             <p className="text-sm font-semibold text-ink-900">{formatRelativeDate(doc.uploadedAt)}</p>
//           </div>
//         </Card>
//       </div>

//       {doc.status === 'processing' && (
//         <Card className="mt-6 p-6">
//           <p className="mb-1 text-sm font-semibold text-ink-900">Processing document</p>
//           <p className="mb-5 text-xs text-ink-500">
//             {formatFileSize(doc.sizeBytes)} · This usually takes under a minute.
//           </p>
//           <LoadingPipeline steps={pipeline} />
//         </Card>
//       )}

//       {doc.status === 'failed' && (
//         <Card className="mt-6 p-6">
//           <EmptyState
//             icon={FileText}
//             title="Processing failed"
//             description="We couldn't process this document. Try re-uploading the file."
//             action={
//               <Button variant="secondary" onClick={() => navigate('/documents')}>
//                 Back to documents
//               </Button>
//             }
//           />
//         </Card>
//       )}

//       {doc.status === 'ready' && (
//         <>
//           <div id="summary-section" className="mt-8">
//             <h2 className="mb-3 text-sm font-semibold text-ink-900">Key information</h2>
//             {summary.length === 0 ? (
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <Skeleton key={i} className="h-20 rounded-xl" />
//                 ))}
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {summary.map((field) => (
//                   <SummaryCard key={field.label} field={field} />
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="mt-8">
//             <h2 className="mb-3 text-sm font-semibold text-ink-900">Recent activity</h2>
//             {questions.length === 0 ? (
//               <EmptyState
//                 icon={HelpCircle}
//                 title="No questions yet"
//                 description="Open the AI chat to start asking questions about this contract."
//                 action={
//                   <Button variant="brand" onClick={() => navigate(`/chat?doc=${doc.id}`)}>
//                     <MessageSquare className="h-4 w-4" />
//                     Open Chat
//                   </Button>
//                 }
//               />
//             ) : (
//               <Card className="divide-y divide-ink-100">
//                 {questions.map((q) => (
//                   <div key={q.id} className="flex items-center gap-3 px-5 py-3.5">
//                     <HelpCircle className="h-4 w-4 shrink-0 text-ink-400" />
//                     <p className="flex-1 text-sm text-ink-800">{q.question}</p>
//                     <span className="shrink-0 text-xs text-ink-400">{formatRelativeDate(q.askedAt)}</span>
//                   </div>
//                 ))}
//               </Card>
//             )}
//           </div>
//         </>
//       )}

//       <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//         <DialogContent title="Delete document">
//           <p className="text-sm text-ink-600">
//             Are you sure you want to delete <span className="font-medium text-ink-900">{doc.name}</span>? This
//             action cannot be undone.
//           </p>
//           <div className="mt-5 flex justify-end gap-2">
//             <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="danger" size="sm" onClick={handleDelete}>
//               Delete
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FileText, ChevronDown, Sparkles } from 'lucide-react'
import { StatusBadge } from '@/components/documents/StatusBadge'
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { SourceDrawer } from '@/components/chat/SourceDrawer'
import { Skeleton } from '@/components/ui/Skeleton'
import { documentService } from '@/services/documentService'
import { chatService } from '@/services/chatService'
import { documents as allDocuments } from '@/mock/data'
import type { ChatMessage, ContractDocument, Citation } from '@/types'

const suggestedPrompts = [
  'Summarize the key obligations',
  'What is the termination notice period?',
  'Are there any confidentiality clauses?',
]

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const docId = searchParams.get('doc') ?? allDocuments.find((d) => d.status === 'ready')?.id ?? ''

  const [doc, setDoc] = useState<ContractDocument | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!docId) return
    setLoadingHistory(true)
    documentService.getById(docId).then((d) => setDoc(d ?? null))
    chatService.getConversation(docId).then((history) => {
      setMessages(history)
      setLoadingHistory(false)
    })
  }, [docId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const readyDocuments = allDocuments.filter((d) => d.status === 'ready')

  const handleSend = async (value: string) => {
    if (!doc) return
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: value,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    const reply = await chatService.sendMessage(doc.id, doc.name, value)
    setIsTyping(false)
    setMessages((prev) => [...prev, reply])
  }

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation)
    setDrawerOpen(true)
  }

  return (
    <div className="-mx-4 -my-8 flex h-[calc(100vh-4rem)] flex-col sm:-mx-6 lg:-mx-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 sm:px-6">
        <div className="relative">
          <button
            onClick={() => setPickerOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-ink-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
              <FileText className="h-4 w-4 text-brand-600" />
            </div>
            <div className="text-left">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                {doc ? doc.name : 'Select a document'}
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              </p>
              {doc && (
                <div className="mt-0.5">
                  <StatusBadge status={doc.status} />
                </div>
              )}
            </div>
          </button>

          {pickerOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setPickerOpen(false)} />
              <div className="absolute left-0 top-full z-40 mt-1 w-72 rounded-xl border border-ink-200 bg-white p-1.5 shadow-lg animate-fade-in">
                {readyDocuments.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSearchParams({ doc: d.id })
                      setPickerOpen(false)
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-ink-50"
                  >
                    <FileText className="h-4 w-4 text-ink-400" />
                    <span className="flex-1 truncate text-ink-800">{d.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => navigate(`/documents/${doc?.id}`)}
          className="text-xs font-medium text-ink-500 hover:text-ink-900"
        >
          View document
        </button>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {loadingHistory ? (
            <div className="space-y-6">
              <Skeleton className="ml-auto h-12 w-2/3 rounded-2xl" />
              <Skeleton className="h-24 w-3/4 rounded-2xl" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center pt-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-base font-semibold text-ink-900">
                Ask anything about {doc?.name ?? 'this contract'}
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-ink-500">
                Get cited answers pulled directly from the source document, page by page.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} onCitationClick={handleCitationClick} />
            ))
          )}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      <ChatInput onSend={handleSend} disabled={!doc || isTyping} />

      <SourceDrawer
        citation={activeCitation}
        documentName={doc?.name ?? ''}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { CitationChip } from './CitationChip'
import { currentUser } from '@/mock/data'
import type { ChatMessage, Citation } from '@/types'

export function ChatMessageBubble({
  message,
  onCitationClick,
}: {
  message: ChatMessage
  onCitationClick: (citation: Citation) => void
}) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <Avatar initials={currentUser.initials} className="mt-0.5" />
      ) : (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className={`flex max-w-[75%] flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={
            isUser
              ? 'rounded-2xl rounded-tr-sm bg-ink-900 px-4 py-2.5 text-[14px] text-white'
              : 'rounded-2xl rounded-tl-sm border border-ink-200 bg-white px-4 py-3 text-[14px] text-ink-800 shadow-sm'
          }
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="markdown-body prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-table:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.citations.map((citation) => (
              <CitationChip key={citation.id} citation={citation} onClick={() => onCitationClick(citation)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

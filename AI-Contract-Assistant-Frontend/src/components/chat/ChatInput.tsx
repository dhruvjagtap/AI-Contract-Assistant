import { useState, useRef, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (value: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-ink-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-ink-200 bg-white p-2 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask anything about this contract..."
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          aria-label="Ask a question about this contract"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            value.trim() && !disabled
              ? 'bg-ink-900 text-white hover:bg-ink-700'
              : 'bg-ink-100 text-ink-300'
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-ink-400">
        AI Contract Assistant can make mistakes. Verify important clauses against the source document.
      </p>
    </div>
  )
}

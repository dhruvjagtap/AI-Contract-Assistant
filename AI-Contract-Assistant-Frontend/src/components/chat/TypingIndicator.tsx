import { Sparkles } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-ink-200 bg-white px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

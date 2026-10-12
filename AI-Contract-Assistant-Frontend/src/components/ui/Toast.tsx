import * as React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastItem {
  id: number
  title: string
  description?: string
  variant: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const iconColors = {
  success: 'text-success-500',
  error: 'text-danger-500',
  info: 'text-brand-500',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 4000)
  }, [])

  const dismiss = (id: number) => setToasts((prev) => prev.filter((item) => item.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.variant]
          return (
            <div
              key={t.id}
              className={cn(
                'animate-fade-in flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-4 shadow-lg'
              )}
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconColors[t.variant])} />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-900">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-ink-500">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="text-ink-400 hover:text-ink-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

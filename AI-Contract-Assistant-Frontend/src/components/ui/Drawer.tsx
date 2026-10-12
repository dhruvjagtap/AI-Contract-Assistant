import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Drawer = DialogPrimitive.Root

export function DrawerContent({
  className,
  children,
  title,
  subtitle,
}: {
  className?: string
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/20 data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-[450px] overflow-y-auto border-l border-ink-200 bg-white shadow-2xl',
          'data-[state=open]:animate-[slide-in_0.28s_ease-out]',
          className
        )}
        style={{ animation: 'slide-in 0.28s ease-out' }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-ink-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <DialogPrimitive.Title className="text-sm font-semibold text-ink-900">{title}</DialogPrimitive.Title>
            {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
          </div>
          <DialogPrimitive.Close className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
        <div className="p-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

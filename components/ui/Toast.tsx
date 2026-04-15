'use client'

import { useToastStore, type Toast } from '@/store/toastStore'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: 'border-l-primary text-primary',
  error: 'border-l-danger text-danger',
  info: 'border-l-secondary text-secondary',
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const Icon = ICONS[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        flex items-start gap-3 bg-surface border border-border border-l-4
        ${COLORS[toast.type]}
        px-4 py-3 shadow-toast min-w-[280px] max-w-[360px]
      `}
      style={{ borderRadius: 0 }}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm text-dark flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => dismiss(toast.id)}
        className="text-muted hover:text-dark transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-2 items-end"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string
  label: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable — select-fallback not needed in admin context
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy ${label}: ${value}`}
      className={cn(
        'border border-border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors',
        copied ? 'border-accent text-accent' : 'text-muted-foreground hover:border-gold hover:text-gold',
        className,
      )}
    >
      {copied ? 'Copied' : label}
    </button>
  )
}

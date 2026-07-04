'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminDeleteMessage, adminMarkMessageRead } from '@/app/actions/admin'
import { cn } from '@/lib/utils'

type MessageRow = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export function MessagesManager({ messages }: { messages: MessageRow[] }) {
  const router = useRouter()
  const [openId, setOpenId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  async function toggleRead(m: MessageRow) {
    if (busy) return
    setBusy(true)
    try {
      await adminMarkMessageRead(m.id, !m.read)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: number) {
    if (busy) return
    if (!window.confirm('Delete this message?')) return
    setBusy(true)
    try {
      await adminDeleteMessage(id)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  if (messages.length === 0) {
    return (
      <p className="border border-border bg-card p-6 text-sm text-muted-foreground">
        No messages yet. Contact form submissions will appear here.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((m) => (
        <li key={m.id} className={cn('border bg-card', m.read ? 'border-border' : 'border-gold/50')}>
          <button
            type="button"
            onClick={() => setOpenId(openId === m.id ? null : m.id)}
            className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-4 text-left"
            aria-expanded={openId === m.id}
          >
            <span className="flex flex-col gap-1">
              <span className="text-sm text-foreground">
                {m.subject || '(No subject)'}
                {!m.read && <span className="ml-2 text-[10px] uppercase tracking-widest text-gold">New</span>}
              </span>
              <span className="text-xs text-muted-foreground">
                {m.name} · {m.email}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(m.createdAt).toLocaleDateString()}
            </span>
          </button>
          {openId === m.id && (
            <div className="flex flex-col gap-4 border-t border-border px-5 py-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{m.message}</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => toggleRead(m)}
                  className="text-xs uppercase tracking-widest text-gold hover:underline"
                >
                  Mark as {m.read ? 'unread' : 'read'}
                </button>
                <a
                  href={`mailto:${m.email}`}
                  className="text-xs uppercase tracking-widest text-accent hover:underline"
                >
                  Reply
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="text-xs uppercase tracking-widest text-ember hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

'use client'

import { useState } from 'react'
import { EmberButton } from '@/components/ember-button'

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'done'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    // Seeded data layer — subscriber storage is wired to the CMS later.
    setStatus('done')
    setEmail('')
  }

  if (status === 'done') {
    return (
      <p className="font-serif text-lg tracking-wide text-gold">
        {'You are in. Welcome to the fire.'}
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? 'flex w-full flex-col gap-3' : 'flex w-full max-w-md flex-col gap-3 sm:flex-row'}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="h-12 flex-1 rounded-sm border border-bronze/50 bg-background px-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
      />
      <EmberButton type="submit" className="h-12">
        Join
      </EmberButton>
    </form>
  )
}

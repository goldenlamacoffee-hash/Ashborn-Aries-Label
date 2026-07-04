'use client'

import { useState } from 'react'
import { EmberButton } from '@/components/ember-button'
import { subscribeToNewsletter } from '@/app/actions/public'

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'saving') return
    setStatus('saving')
    setError(null)
    const result = await subscribeToNewsletter(email)
    if (result.ok) {
      setStatus('done')
      setEmail('')
    } else {
      setStatus('idle')
      setError(result.error ?? 'Something went wrong.')
    }
  }

  if (status === 'done') {
    return (
      <p className="font-serif text-lg tracking-wide text-gold">
        {'You are in. Welcome to the herd.'}
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
        {status === 'saving' ? 'Joining…' : 'Join'}
      </EmberButton>
      {error && (
        <p role="alert" className="font-sans text-xs text-ember">
          {error}
        </p>
      )}
    </form>
  )
}

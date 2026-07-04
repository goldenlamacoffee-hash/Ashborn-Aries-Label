'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { EmberButton } from '@/components/ember-button'

export function AdminLoginForm({ allowSignUp = false }: { allowSignUp?: boolean }) {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(allowSignUp ? 'sign-up' : 'sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const result =
        mode === 'sign-in'
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({ email, password, name: name || email })
      if (result.error) {
        setError(result.error.message ?? 'Authentication failed.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Authentication failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'h-11 w-full rounded-sm border border-input bg-background px-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      {mode === 'sign-up' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-name" className="font-sans text-xs text-muted-foreground">
            Name
          </label>
          <input
            id="admin-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="admin-email" className="font-sans text-xs text-muted-foreground">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@ashbornaries.com"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="admin-password" className="font-sans text-xs text-muted-foreground">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p role="alert" className="font-sans text-xs text-ember">
          {error}
        </p>
      )}
      <EmberButton type="submit" className="mt-2 h-11 w-full">
        {loading ? 'Working…' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
      </EmberButton>
      {allowSignUp && (
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')
            setError(null)
          }}
          className="font-sans text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
        >
          {mode === 'sign-in' ? 'First time? Create the admin account' : 'Back to sign in'}
        </button>
      )}
    </form>
  )
}

'use client'

import { useState, useTransition } from 'react'
import useSWR from 'swr'
import { adminGetDiagnostics, adminPublishNow } from '@/app/actions/admin'

type Diagnostics = Awaited<ReturnType<typeof adminGetDiagnostics>>

const LABELS: Record<keyof Diagnostics['lastUpdated'], string> = {
  releases: 'Releases',
  tracks: 'Tracks & Lyrics',
  artists: 'Artists',
  settings: 'Site Settings',
  media: 'Media Library',
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'never'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function SyncStatusPanel() {
  const { data, error, isLoading, mutate } = useSWR<Diagnostics>(
    'admin-diagnostics',
    () => adminGetDiagnostics(),
    { refreshInterval: 30000 },
  )
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function publishNow() {
    startTransition(async () => {
      const result = await adminPublishNow()
      setPublishedAt(result.at)
      mutate()
    })
  }

  return (
    <section className="mt-10 border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-foreground">Sync status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saves publish instantly here; the live site refreshes within 60 seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={publishNow}
          disabled={pending}
          className="border border-primary bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          {pending ? 'Publishing…' : 'Publish changes now'}
        </button>
      </div>

      {publishedAt && (
        <p className="mt-3 text-xs text-accent">
          Public page cache purged at {new Date(publishedAt).toLocaleTimeString()}.
        </p>
      )}

      {error ? (
        <p className="mt-4 text-sm text-destructive">
          Database check failed — changes may not be saving. Refresh and try again.
        </p>
      ) : isLoading || !data ? (
        <p className="mt-4 text-sm text-muted-foreground">Checking database…</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          {(Object.keys(LABELS) as (keyof Diagnostics['lastUpdated'])[]).map((key) => (
            <div key={key} className="border border-border/60 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {LABELS[key]}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {timeAgo(data.lastUpdated[key])}
              </p>
            </div>
          ))}
        </div>
      )}

      {data && (
        <p className="mt-3 text-xs text-muted-foreground">
          Database connected {'\u00B7'} query latency {data.dbLatencyMs}ms {'\u00B7'} last edit
          times shown above prove saves are reaching the database.
        </p>
      )}
    </section>
  )
}

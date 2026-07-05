'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  adminReorderTracks,
  adminUpdateTrack,
} from '@/app/actions/admin'

export type PanelTrack = {
  id: number
  slug: string
  title: string
  trackNumber: number
  published: boolean
}

/**
 * Tracks panel shown inside the release editor.
 * Lists this release's tracks with reorder, publish toggle, and links
 * to the full track editor and public lyric page.
 */
export function ReleaseTracksPanel({
  releaseId,
  releaseSlug,
  tracks,
}: {
  releaseId: number
  releaseSlug: string
  tracks: PanelTrack[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sorted = [...tracks].sort((a, b) => a.trackNumber - b.trackNumber)

  async function move(index: number, dir: -1 | 1) {
    if (busy) return
    const target = index + dir
    if (target < 0 || target >= sorted.length) return
    setBusy(true)
    setError(null)
    try {
      const ids = sorted.map((t) => t.id)
      ;[ids[index], ids[target]] = [ids[target], ids[index]]
      await adminReorderTracks(releaseId, ids)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reorder failed.')
    } finally {
      setBusy(false)
    }
  }

  async function togglePublished(track: PanelTrack) {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await adminUpdateTrack(track.id, { published: !track.published })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 border border-bronze/40 bg-secondary/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-lg text-foreground">
          Tracks <span className="text-sm text-muted-foreground">({sorted.length})</span>
        </h3>
        <Link
          href={`/admin/tracks?release=${releaseId}`}
          className="border border-bronze px-3 py-1.5 text-[10px] uppercase tracking-widest text-gold hover:border-gold"
        >
          Add / Edit Tracks
        </Link>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tracks yet. Use “Add / Edit Tracks” to create the tracklist for this release.
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-border">
          {sorted.map((t, i) => (
            <li key={t.id} className="flex items-center gap-3 py-2">
              <span className="w-7 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {String(t.trackNumber).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{t.title}</span>
              <span
                className={
                  t.published
                    ? 'text-[10px] uppercase tracking-widest text-accent'
                    : 'text-[10px] uppercase tracking-widest text-muted-foreground'
                }
              >
                {t.published ? 'Published' : 'Draft'}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={busy || i === 0}
                  aria-label={`Move ${t.title} up`}
                  className="border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={busy || i === sorted.length - 1}
                  aria-label={`Move ${t.title} down`}
                  className="border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => togglePublished(t)}
                  disabled={busy}
                  className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  {t.published ? 'Unpublish' : 'Publish'}
                </button>
                {t.published && (
                  <a
                    href={`/lyrics/${releaseSlug}/${t.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold hover:border-gold"
                  >
                    View
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      {error && (
        <p role="alert" className="text-xs text-ember">
          {error}
        </p>
      )}
    </div>
  )
}

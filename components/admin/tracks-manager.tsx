'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  adminCreateTrack,
  adminDeleteTrack,
  adminUpdateTrack,
  type TrackInput,
} from '@/app/actions/admin'
import { AdminField, AdminTable, adminInputClass } from '@/components/admin/admin-ui'

export type TrackRow = TrackInput & { id: number; updatedAt: string }

export function TracksManager({
  tracks,
  releaseOptions,
  initialReleaseFilter,
}: {
  tracks: TrackRow[]
  releaseOptions: { id: number; title: string; slug: string }[]
  initialReleaseFilter?: number
}) {
  const router = useRouter()
  const [releaseFilter, setReleaseFilter] = useState<number | 'all'>(initialReleaseFilter ?? 'all')
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<TrackInput | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const visible = releaseFilter === 'all' ? tracks : tracks.filter((t) => t.releaseId === releaseFilter)

  function releaseTitle(id: number) {
    return releaseOptions.find((r) => r.id === id)?.title ?? `#${id}`
  }

  function releaseSlug(id: number) {
    return releaseOptions.find((r) => r.id === id)?.slug ?? ''
  }

  function startNew() {
    setForm({
      releaseId: releaseFilter === 'all' ? (releaseOptions[0]?.id ?? 0) : releaseFilter,
      slug: '',
      title: '',
      trackNumber: visible.length + 1,
      duration: '',
      storyNote: '',
      lyricsStanzas: [],
      spokenIntro: '',
      spokenOutro: '',
      creditsList: [],
      published: true,
    })
    setEditingId('new')
    setError(null)
  }

  function startEdit(row: TrackRow) {
    const { id: _id, ...rest } = row
    setForm(rest)
    setEditingId(row.id)
    setError(null)
  }

  function set<K extends keyof TrackInput>(key: K, value: TrackInput[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f))
  }

  async function handleSave() {
    if (!form || busy) return
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!form.releaseId) {
      setError('Every track must belong to a release. Select one.')
      return
    }
    if (!Number.isInteger(form.trackNumber) || form.trackNumber < 1) {
      setError('Track number must be a positive whole number.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (editingId === 'new') {
        await adminCreateTrack(form)
      } else if (typeof editingId === 'number') {
        await adminUpdateTrack(editingId, form)
      }
      setEditingId(null)
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error && err.message && !err.message.includes('unexpected response')
        ? err.message
        : 'Save failed. Check the track number and slug are unique within this release.'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: number) {
    if (busy) return
    if (!window.confirm('Delete this track and its lyrics?')) return
    setBusy(true)
    try {
      await adminDeleteTrack(id)
      if (editingId === id) setEditingId(null)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="track-filter" className="text-xs uppercase tracking-widest text-muted-foreground">
            Release
          </label>
          <select
            id="track-filter"
            className={adminInputClass + ' w-auto'}
            value={releaseFilter}
            onChange={(e) => setReleaseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All releases</option>
            {releaseOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="border border-primary bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5"
        >
          New Track
        </button>
      </div>

      <AdminTable headers={['#', 'Title', 'Release', 'Status', 'Updated', 'Actions']}>
        {visible.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3 text-muted-foreground">{row.trackNumber}</td>
            <td className="px-4 py-3 text-foreground">{row.title}</td>
            <td className="px-4 py-3 text-muted-foreground">{releaseTitle(row.releaseId)}</td>
            <td className="px-4 py-3">
              <span className={row.published ? 'text-xs uppercase tracking-widest text-accent' : 'text-xs uppercase tracking-widest text-muted-foreground'}>
                {row.published ? 'Published' : 'Draft'}
              </span>
            </td>
            <td className="px-4 py-3 text-xs text-muted-foreground">
              {new Date(row.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-3">
                <button type="button" onClick={() => startEdit(row)} className="text-xs uppercase tracking-widest text-gold hover:underline">
                  Edit
                </button>
                {row.published && releaseSlug(row.releaseId) && (
                  <a
                    href={`/lyrics/${releaseSlug(row.releaseId)}/${row.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:underline"
                  >
                    View
                  </a>
                )}
                <button type="button" onClick={() => handleDelete(row.id)} className="text-xs uppercase tracking-widest text-ember hover:underline">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {form && editingId !== null && (
        <div className="flex flex-col gap-5 border border-border bg-card p-6">
          <h2 className="font-serif text-xl text-foreground">
            {editingId === 'new' ? 'New Track' : `Editing: ${form.title}`}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Title" id="trk-title">
              <input id="trk-title" className={adminInputClass} value={form.title} onChange={(e) => set('title', e.target.value)} />
            </AdminField>
            <AdminField label="Slug" id="trk-slug">
              <input id="trk-slug" className={adminInputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </AdminField>
            <AdminField label="Release" id="trk-release">
              <select id="trk-release" className={adminInputClass} value={form.releaseId} onChange={(e) => set('releaseId', Number(e.target.value))}>
                {releaseOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Track Number" id="trk-num">
              <input id="trk-num" type="number" className={adminInputClass} value={form.trackNumber} onChange={(e) => set('trackNumber', Number(e.target.value))} />
            </AdminField>
            <AdminField label="Duration" id="trk-dur" hint="e.g. 3:42">
              <input id="trk-dur" className={adminInputClass} value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </AdminField>
          </div>
          <AdminField label="Lyrics" id="trk-lyrics" hint="Separate stanzas with a blank line.">
            <textarea
              id="trk-lyrics"
              rows={12}
              className={adminInputClass}
              value={form.lyricsStanzas.join('\n\n')}
              onChange={(e) =>
                set(
                  'lyricsStanzas',
                  e.target.value
                    .split(/\n\s*\n/)
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </AdminField>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Spoken Intro" id="trk-intro">
              <textarea id="trk-intro" rows={2} className={adminInputClass} value={form.spokenIntro} onChange={(e) => set('spokenIntro', e.target.value)} />
            </AdminField>
            <AdminField label="Spoken Outro" id="trk-outro">
              <textarea id="trk-outro" rows={2} className={adminInputClass} value={form.spokenOutro} onChange={(e) => set('spokenOutro', e.target.value)} />
            </AdminField>
          </div>
          <AdminField label="Story Note" id="trk-story" hint="Shown alongside the lyrics on the public site.">
            <textarea id="trk-story" rows={3} className={adminInputClass} value={form.storyNote} onChange={(e) => set('storyNote', e.target.value)} />
          </AdminField>
          <AdminField label="Credits" id="trk-credits" hint="One per line.">
            <textarea
              id="trk-credits"
              rows={2}
              className={adminInputClass}
              value={form.creditsList.join('\n')}
              onChange={(e) => set('creditsList', e.target.value.split('\n').filter((l) => l.trim()))}
            />
          </AdminField>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
            Published
          </label>
          {error && (
            <p role="alert" className="text-xs text-ember">
              {error}
            </p>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save Track'}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

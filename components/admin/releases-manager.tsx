'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  adminCreateRelease,
  adminDeleteRelease,
  adminUpdateRelease,
  type ReleaseInput,
} from '@/app/actions/admin'
import { AdminField, AdminTable, adminInputClass } from '@/components/admin/admin-ui'
import { cn } from '@/lib/utils'

export type ReleaseRow = ReleaseInput & { id: number }

const emptyRelease: ReleaseInput = {
  slug: '',
  title: '',
  artistId: null,
  type: 'album',
  releaseDate: '',
  cover: '',
  description: '',
  story: '',
  mood: '',
  tags: [],
  credits: [],
  featured: false,
  published: true,
  sortOrder: 0,
  streamingLinks: {},
}

export function ReleasesManager({
  releases,
  artistOptions,
}: {
  releases: ReleaseRow[]
  artistOptions: { id: number; name: string }[]
}) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<ReleaseInput>(emptyRelease)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editing = editingId !== null

  function startNew() {
    setForm(emptyRelease)
    setEditingId('new')
    setError(null)
  }

  function startEdit(row: ReleaseRow) {
    const { id: _id, ...rest } = row
    setForm(rest)
    setEditingId(row.id)
    setError(null)
  }

  function set<K extends keyof ReleaseInput>(key: K, value: ReleaseInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    if (busy) return
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (editingId === 'new') {
        await adminCreateRelease(form)
      } else if (typeof editingId === 'number') {
        await adminUpdateRelease(editingId, form)
      }
      setEditingId(null)
      router.refresh()
    } catch {
      setError('Save failed. Check the slug is unique and try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: number) {
    if (busy) return
    if (!window.confirm('Delete this release and all of its tracks? This cannot be undone.')) return
    setBusy(true)
    try {
      await adminDeleteRelease(id)
      if (editingId === id) setEditingId(null)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  const streamingText = useMemo(
    () =>
      Object.entries(form.streamingLinks)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n'),
    [form.streamingLinks],
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {releases.length} release{releases.length === 1 ? '' : 's'} in the catalog.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="border border-primary bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5"
        >
          New Release
        </button>
      </div>

      <AdminTable headers={['Cover', 'Title', 'Type', 'Date', 'Status', 'Actions']}>
        {releases.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              {row.cover ? (
                <Image
                  src={row.cover || '/placeholder.svg'}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-sm border border-border object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-sm border border-border bg-secondary" />
              )}
            </td>
            <td className="px-4 py-3 text-foreground">
              {row.title}
              {row.featured && <span className="ml-2 text-xs text-gold">Featured</span>}
            </td>
            <td className="px-4 py-3 capitalize text-muted-foreground">{row.type}</td>
            <td className="px-4 py-3 text-muted-foreground">{row.releaseDate}</td>
            <td className="px-4 py-3">
              <span className={cn('text-xs uppercase tracking-widest', row.published ? 'text-accent' : 'text-muted-foreground')}>
                {row.published ? 'Published' : 'Draft'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-3">
                <button type="button" onClick={() => startEdit(row)} className="text-xs uppercase tracking-widest text-gold hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(row.id)} className="text-xs uppercase tracking-widest text-ember hover:underline">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {editing && (
        <div className="flex flex-col gap-5 border border-border bg-card p-6">
          <h2 className="font-serif text-xl text-foreground">
            {editingId === 'new' ? 'New Release' : `Editing: ${form.title}`}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Title" id="rel-title">
              <input id="rel-title" className={adminInputClass} value={form.title} onChange={(e) => set('title', e.target.value)} />
            </AdminField>
            <AdminField label="Slug" id="rel-slug" hint="Used in URLs, e.g. ex-igne-et-dolore">
              <input id="rel-slug" className={adminInputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </AdminField>
            <AdminField label="Type" id="rel-type">
              <select id="rel-type" className={adminInputClass} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="album">Album</option>
                <option value="single">Single</option>
                <option value="ep">EP</option>
              </select>
            </AdminField>
            <AdminField label="Artist" id="rel-artist">
              <select
                id="rel-artist"
                className={adminInputClass}
                value={form.artistId ?? ''}
                onChange={(e) => set('artistId', e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">— None —</option>
                {artistOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Release Date" id="rel-date" hint="Free text, e.g. 2025">
              <input id="rel-date" className={adminInputClass} value={form.releaseDate} onChange={(e) => set('releaseDate', e.target.value)} />
            </AdminField>
            <AdminField label="Cover Image Path" id="rel-cover" hint="e.g. /images/covers/ex-igne.webp">
              <input id="rel-cover" className={adminInputClass} value={form.cover} onChange={(e) => set('cover', e.target.value)} />
            </AdminField>
            <AdminField label="Mood" id="rel-mood">
              <input id="rel-mood" className={adminInputClass} value={form.mood} onChange={(e) => set('mood', e.target.value)} />
            </AdminField>
            <AdminField label="Sort Order" id="rel-sort">
              <input
                id="rel-sort"
                type="number"
                className={adminInputClass}
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', Number(e.target.value))}
              />
            </AdminField>
          </div>
          <AdminField label="Description" id="rel-desc">
            <textarea id="rel-desc" rows={2} className={adminInputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </AdminField>
          <AdminField label="Story" id="rel-story">
            <textarea id="rel-story" rows={5} className={adminInputClass} value={form.story} onChange={(e) => set('story', e.target.value)} />
          </AdminField>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Tags" id="rel-tags" hint="Comma separated, e.g. fire, rebirth">
              <input
                id="rel-tags"
                className={adminInputClass}
                value={form.tags.join(', ')}
                onChange={(e) =>
                  set(
                    'tags',
                    e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
              />
            </AdminField>
            <AdminField label="Credits" id="rel-credits" hint="One per line">
              <textarea
                id="rel-credits"
                rows={2}
                className={adminInputClass}
                value={form.credits.join('\n')}
                onChange={(e) => set('credits', e.target.value.split('\n').filter((l) => l.trim()))}
              />
            </AdminField>
          </div>
          <AdminField label="Streaming Links" id="rel-links" hint="One per line as platform=url, e.g. spotify=https://...">
            <textarea
              id="rel-links"
              rows={4}
              className={adminInputClass}
              defaultValue={streamingText}
              onChange={(e) => {
                const links: Record<string, string> = {}
                for (const line of e.target.value.split('\n')) {
                  const idx = line.indexOf('=')
                  if (idx > 0) links[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
                }
                set('streamingLinks', links)
              }}
            />
          </AdminField>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              Published
            </label>
          </div>
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
              {busy ? 'Saving…' : 'Save Release'}
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

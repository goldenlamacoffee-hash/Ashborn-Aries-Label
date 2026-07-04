'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  adminCreateArtist,
  adminDeleteArtist,
  adminUpdateArtist,
  type ArtistInput,
} from '@/app/actions/admin'
import { AdminField, AdminTable, adminInputClass } from '@/components/admin/admin-ui'
import { MediaPicker } from '@/components/admin/media-picker'

export type ArtistRow = ArtistInput & { id: number }

const emptyArtist: ArtistInput = {
  slug: '',
  name: '',
  role: '',
  tagline: '',
  bio: '',
  image: '',
  links: {},
  pressKitNote: '',
  sortOrder: 0,
  published: true,
}

export function ArtistsManager({ artists }: { artists: ArtistRow[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<ArtistInput>(emptyArtist)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startNew() {
    setForm(emptyArtist)
    setEditingId('new')
    setError(null)
  }

  function startEdit(row: ArtistRow) {
    const { id: _id, ...rest } = row
    setForm(rest)
    setEditingId(row.id)
    setError(null)
  }

  function set<K extends keyof ArtistInput>(key: K, value: ArtistInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    if (busy) return
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (editingId === 'new') {
        await adminCreateArtist(form)
      } else if (typeof editingId === 'number') {
        await adminUpdateArtist(editingId, form)
      }
      setEditingId(null)
      router.refresh()
    } catch {
      setError('Save failed. Check the slug is unique.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: number) {
    if (busy) return
    if (!window.confirm('Delete this artist?')) return
    setBusy(true)
    try {
      await adminDeleteArtist(id)
      if (editingId === id) setEditingId(null)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {artists.length} artist{artists.length === 1 ? '' : 's'} on the roster.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="border border-primary bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5"
        >
          New Artist
        </button>
      </div>

      <AdminTable headers={['Photo', 'Name', 'Role', 'Status', 'Actions']}>
        {artists.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              {row.image ? (
                <Image
                  src={row.image || '/placeholder.svg'}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full border border-border object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full border border-border bg-secondary" />
              )}
            </td>
            <td className="px-4 py-3 text-foreground">{row.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{row.role}</td>
            <td className="px-4 py-3">
              <span className={row.published ? 'text-xs uppercase tracking-widest text-accent' : 'text-xs uppercase tracking-widest text-muted-foreground'}>
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

      {editingId !== null && (
        <div className="flex flex-col gap-5 border border-border bg-card p-6">
          <h2 className="font-serif text-xl text-foreground">
            {editingId === 'new' ? 'New Artist' : `Editing: ${form.name}`}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Name" id="art-name">
              <input id="art-name" className={adminInputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </AdminField>
            <AdminField label="Slug" id="art-slug">
              <input id="art-slug" className={adminInputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </AdminField>
            <AdminField label="Role" id="art-role" hint="e.g. Founder. Voice of the fire.">
              <input id="art-role" className={adminInputClass} value={form.role} onChange={(e) => set('role', e.target.value)} />
            </AdminField>
            <MediaPicker
              label="Artist Image"
              value={form.image}
              onChange={(url) => set('image', url)}
              categoryHint="artist-image"
              hint="Pick from the Media Library."
            />
          </div>
          <AdminField label="Tagline" id="art-tagline">
            <input id="art-tagline" className={adminInputClass} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </AdminField>
          <AdminField label="Bio" id="art-bio">
            <textarea id="art-bio" rows={6} className={adminInputClass} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
          </AdminField>
          <AdminField label="Links" id="art-links" hint="One per line as platform=url">
            <textarea
              id="art-links"
              rows={3}
              className={adminInputClass}
              defaultValue={Object.entries(form.links)
                .map(([k, v]) => `${k}=${v}`)
                .join('\n')}
              onChange={(e) => {
                const links: Record<string, string> = {}
                for (const line of e.target.value.split('\n')) {
                  const idx = line.indexOf('=')
                  if (idx > 0) links[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
                }
                set('links', links)
              }}
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
              {busy ? 'Saving…' : 'Save Artist'}
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

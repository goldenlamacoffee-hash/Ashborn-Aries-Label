'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  adminCreateMediaAsset,
  adminDeleteMediaAsset,
  adminUpdateMediaAsset,
  type MediaInput,
} from '@/app/actions/media'
import type { MediaUsage } from '@/lib/media/get-media-usage'
import type { MediaAsset } from '@/lib/db/schema'
import { AdminField, adminInputClass } from '@/components/admin/admin-ui'
import { CopyButton } from '@/components/admin/copy-button'
import { MEDIA_CATEGORIES, MEDIA_TYPES, labelize } from '@/lib/media/constants'

type FormState = {
  url: string
  title: string
  altText: string
  caption: string
  description: string
  category: string
  type: string
  tags: string
  isPublic: boolean
}

function toFormState(asset?: MediaAsset | null): FormState {
  return {
    url: asset?.url ?? '',
    title: asset?.title ?? '',
    altText: asset?.altText ?? '',
    caption: asset?.caption ?? '',
    description: asset?.description ?? '',
    category: asset?.category ?? 'other',
    type: asset?.type ?? 'image',
    tags: (asset?.tags ?? []).join(', '),
    isPublic: asset?.isPublic ?? true,
  }
}

export function MediaAssetForm({
  asset,
  onDone,
  onCancel,
}: {
  asset?: MediaAsset | null
  onDone: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(asset))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteUsages, setDeleteUsages] = useState<MediaUsage[] | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const editing = Boolean(asset)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toInput(): MediaInput {
    return {
      url: form.url.trim(),
      title: form.title.trim(),
      altText: form.altText.trim(),
      caption: form.caption.trim(),
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isPublic: form.isPublic,
    }
  }

  async function handleSave() {
    if (busy) return
    setBusy(true)
    setError(null)
    const input = toInput()
    const result = asset
      ? await adminUpdateMediaAsset(asset.id, input)
      : await adminCreateMediaAsset(input)
    setBusy(false)
    if (result.ok) {
      onDone()
    } else {
      setError(result.error)
    }
  }

  async function handleDelete(force = false) {
    if (!asset || busy) return
    if (force && deleteConfirmText !== 'DELETE') {
      setError('Type DELETE to confirm forced deletion.')
      return
    }
    if (!force && !window.confirm('Delete this media asset? This cannot be undone.')) return
    setBusy(true)
    setError(null)
    const result = await adminDeleteMediaAsset(asset.id, { force })
    setBusy(false)
    if (result.ok) {
      onDone()
    } else if (result.usages && result.usages.length > 0) {
      setDeleteUsages(result.usages)
    } else {
      setError(result.error ?? 'Delete failed.')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative aspect-square w-full max-w-[180px] shrink-0 overflow-hidden border border-border bg-secondary">
          {form.url ? (
            <Image
              src={form.url || '/placeholder.svg'}
              alt={form.altText || 'Asset preview'}
              fill
              className="object-cover"
              sizes="180px"
              unoptimized={!form.url.startsWith('/')}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No preview
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <AdminField label="Image URL" id="ma-url" hint="Local path (/images/...) or full https:// URL">
            <input
              id="ma-url"
              className={adminInputClass}
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
              placeholder="/images/... or https://..."
            />
          </AdminField>
          {editing && asset && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Asset ID: {asset.id}
              </span>
              <CopyButton value={String(asset.id)} label="Copy ID" />
              <CopyButton value={asset.url || asset.path} label="Copy URL" />
            </div>
          )}
          <AdminField label="Title" id="ma-title" hint="Required">
            <input
              id="ma-title"
              className={adminInputClass}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </AdminField>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Alt Text" id="ma-alt" hint="Required for public images">
          <input
            id="ma-alt"
            className={adminInputClass}
            value={form.altText}
            onChange={(e) => set('altText', e.target.value)}
          />
        </AdminField>
        <AdminField label="Caption" id="ma-caption">
          <input
            id="ma-caption"
            className={adminInputClass}
            value={form.caption}
            onChange={(e) => set('caption', e.target.value)}
          />
        </AdminField>
        <AdminField label="Category" id="ma-category">
          <select
            id="ma-category"
            className={adminInputClass}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {labelize(c)}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Type" id="ma-type">
          <select
            id="ma-type"
            className={adminInputClass}
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
          >
            {MEDIA_TYPES.map((t) => (
              <option key={t} value={t}>
                {labelize(t)}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <AdminField label="Description" id="ma-desc">
        <textarea
          id="ma-desc"
          rows={2}
          className={adminInputClass}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </AdminField>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Tags" id="ma-tags" hint="Comma separated">
          <input
            id="ma-tags"
            className={adminInputClass}
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
          />
        </AdminField>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => set('isPublic', e.target.checked)}
          />
          Public asset
        </label>
      </div>

      {error && (
        <p role="alert" className="text-xs text-ember">
          {error}
        </p>
      )}

      {deleteUsages && (
        <div className="flex flex-col gap-3 border border-ember/50 bg-secondary p-4">
          <p className="text-sm font-semibold text-ember">
            This asset is currently used in {deleteUsages.length} place
            {deleteUsages.length === 1 ? '' : 's'}:
          </p>
          <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
            {deleteUsages.map((u, i) => (
              <li key={i}>
                {u.field} — {u.entityTitle}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Deleting will leave broken references. Type DELETE to force-delete anyway, or set the
            asset to not public instead.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              className={adminInputClass + ' max-w-[160px]'}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              aria-label="Type DELETE to confirm"
            />
            <button
              type="button"
              onClick={() => handleDelete(true)}
              disabled={busy || deleteConfirmText !== 'DELETE'}
              className="border border-ember px-4 py-2 text-xs uppercase tracking-widest text-ember disabled:opacity-50"
            >
              Force Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteUsages(null)
                setDeleteConfirmText('')
              }}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Keep Asset
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? 'Saving…' : editing ? 'Save Changes' : 'Add Asset'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        {editing && !deleteUsages && (
          <button
            type="button"
            onClick={() => handleDelete(false)}
            disabled={busy}
            className="ml-auto border border-ember/50 px-6 py-3 text-xs uppercase tracking-widest text-ember hover:border-ember disabled:opacity-60"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

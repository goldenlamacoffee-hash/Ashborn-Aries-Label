'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AdminField, AdminTable, adminInputClass } from '@/components/admin/admin-ui'
import { MediaAssetPickerDialog } from '@/components/admin/media-picker'
import {
  adminAddGalleryItem,
  adminCreateCollection,
  adminDeleteCollection,
  adminListGalleryItems,
  adminRemoveGalleryItem,
  adminReorderGalleryItems,
  adminUpdateCollection,
  adminUpdateGalleryItem,
  type GalleryItemWithAsset,
} from '@/app/actions/media'
import type { GalleryCollection, MediaAsset } from '@/lib/db/schema'
import { cn } from '@/lib/utils'

type CollectionForm = {
  slug: string
  title: string
  description: string
  isPublished: boolean
  sortOrder: number
}

const emptyForm: CollectionForm = {
  slug: '',
  title: '',
  description: '',
  isPublished: true,
  sortOrder: 0,
}

export function GalleryManager({ collections }: { collections: GalleryCollection[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<CollectionForm>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  // Items panel state
  const [openCollection, setOpenCollection] = useState<GalleryCollection | null>(null)
  const [items, setItems] = useState<GalleryItemWithAsset[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  function set<K extends keyof CollectionForm>(key: K, value: CollectionForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function startCreate() {
    setForm({ ...emptyForm, sortOrder: collections.length + 1 })
    setEditingId(null)
    setError(null)
    setMode('create')
  }

  function startEdit(c: GalleryCollection) {
    setForm({
      slug: c.slug,
      title: c.title,
      description: c.description,
      isPublished: c.isPublished,
      sortOrder: c.sortOrder,
    })
    setEditingId(c.id)
    setError(null)
    setMode('edit')
  }

  function save() {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await adminCreateCollection(form)
          : await adminUpdateCollection(editingId as number, form)
      if (!result.ok) {
        setError(result.error ?? 'Save failed.')
        return
      }
      setMode('list')
      router.refresh()
    })
  }

  function remove(id: number) {
    if (!window.confirm('Delete this collection and its items? The media assets are kept.')) return
    startTransition(async () => {
      await adminDeleteCollection(id)
      if (openCollection?.id === id) setOpenCollection(null)
      router.refresh()
    })
  }

  async function openItems(c: GalleryCollection) {
    setOpenCollection(c)
    setItemsLoading(true)
    setItems(await adminListGalleryItems(c.id))
    setItemsLoading(false)
  }

  async function refreshItems() {
    if (!openCollection) return
    setItems(await adminListGalleryItems(openCollection.id))
  }

  function addAsset(asset: MediaAsset) {
    if (!openCollection) return
    setPickerOpen(false)
    startTransition(async () => {
      await adminAddGalleryItem({ collectionId: openCollection.id, mediaAssetId: asset.id })
      await refreshItems()
      router.refresh()
    })
  }

  function moveItem(index: number, dir: -1 | 1) {
    const next = [...items]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    startTransition(async () => {
      await adminReorderGalleryItems(next.map((i) => i.id))
    })
  }

  function toggleVisible(item: GalleryItemWithAsset) {
    startTransition(async () => {
      await adminUpdateGalleryItem(item.id, { isVisible: !item.isVisible })
      await refreshItems()
    })
  }

  function removeItem(id: number) {
    startTransition(async () => {
      await adminRemoveGalleryItem(id)
      await refreshItems()
      router.refresh()
    })
  }

  /* ------------------------------------------------------------- render */

  if (mode !== 'list') {
    return (
      <div className="flex flex-col gap-6 border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">
          {mode === 'create' ? 'New collection' : `Edit: ${form.title}`}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AdminField label="Title" id="col-title">
            <input id="col-title" className={adminInputClass} value={form.title} onChange={(e) => set('title', e.target.value)} />
          </AdminField>
          <AdminField label="Slug" id="col-slug" hint="e.g. tattoo-art">
            <input id="col-slug" className={adminInputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </AdminField>
          <AdminField label="Sort order" id="col-sort">
            <input
              id="col-sort"
              type="number"
              className={adminInputClass}
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', Number(e.target.value) || 0)}
            />
          </AdminField>
          <AdminField label="Published" id="col-pub">
            <label className="flex h-10 items-center gap-2 font-sans text-sm text-foreground">
              <input
                id="col-pub"
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => set('isPublished', e.target.checked)}
              />
              Visible on the public site
            </label>
          </AdminField>
        </div>
        <AdminField label="Description" id="col-desc">
          <textarea
            id="col-desc"
            rows={3}
            className={cn(adminInputClass, 'h-auto py-2')}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </AdminField>
        {error && (
          <p role="alert" className="font-sans text-xs text-ember">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="border border-gold/80 bg-primary px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:border-gold disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Save collection'}
          </button>
          <button
            type="button"
            onClick={() => setMode('list')}
            className="border border-border px-5 py-2 font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-muted-foreground">
          {collections.length} collections
        </p>
        <button
          type="button"
          onClick={startCreate}
          className="border border-gold/80 bg-primary px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:border-gold"
        >
          New collection
        </button>
      </div>

      <AdminTable headers={['Order', 'Title', 'Slug', 'Status', 'Actions']}>
        {collections.map((c) => (
          <tr key={c.id} className="border-t border-border">
            <td className="px-4 py-3 font-sans text-sm text-muted-foreground">{c.sortOrder}</td>
            <td className="px-4 py-3 font-sans text-sm text-foreground">{c.title}</td>
            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.slug}</td>
            <td className="px-4 py-3 font-sans text-xs uppercase tracking-widest">
              <span className={c.isPublished ? 'text-gold' : 'text-muted-foreground'}>
                {c.isPublished ? 'Published' : 'Hidden'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-3 font-sans text-xs uppercase tracking-widest">
                <button type="button" onClick={() => openItems(c)} className="text-gold hover:text-foreground">
                  Items
                </button>
                <button type="button" onClick={() => startEdit(c)} className="text-muted-foreground hover:text-foreground">
                  Edit
                </button>
                <button type="button" onClick={() => remove(c.id)} className="text-ember hover:text-foreground">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {openCollection && (
        <section className="flex flex-col gap-4 border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-foreground">
              Items in “{openCollection.title}”
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="border border-gold/80 bg-primary px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:border-gold"
              >
                Add from library
              </button>
              <button
                type="button"
                onClick={() => setOpenCollection(null)}
                className="border border-border px-4 py-2 font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>

          {itemsLoading ? (
            <p className="font-sans text-sm text-muted-foreground">Loading items…</p>
          ) : items.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">
              No items yet. Add images from the Media Library.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 border border-border bg-background p-3"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden border border-border">
                    {item.asset ? (
                      <Image
                        src={item.asset.url || '/placeholder.svg'}
                        alt={item.asset.altText || item.asset.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-sans text-[10px] text-muted-foreground">
                        Missing
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm text-foreground">
                      {item.title || item.asset?.title || `Asset #${item.mediaAssetId}`}
                    </p>
                    <p className="truncate font-sans text-xs text-muted-foreground">
                      {item.asset?.category ?? 'unknown'} · sort {item.sortOrder}
                      {!item.isVisible && ' · hidden'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 font-sans text-xs uppercase tracking-widest">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || pending}
                      className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      {'\u2191'}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1 || pending}
                      className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move down"
                    >
                      {'\u2193'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisible(item)}
                      className="px-2 py-1 text-muted-foreground hover:text-foreground"
                    >
                      {item.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="px-2 py-1 text-ember hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <MediaAssetPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addAsset}
      />
    </div>
  )
}

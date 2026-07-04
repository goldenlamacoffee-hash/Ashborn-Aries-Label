'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { MediaAsset } from '@/lib/db/schema'
import { MediaAssetCard } from '@/components/admin/media-asset-card'
import { MediaAssetForm } from '@/components/admin/media-asset-form'
import { CopyButton } from '@/components/admin/copy-button'
import { AdminTable } from '@/components/admin/admin-ui'
import { MEDIA_CATEGORIES, MEDIA_TYPES, labelize } from '@/lib/media/constants'
import { cn } from '@/lib/utils'

type Stats = { total: number; used: number; unused: number; recent: number }

export function MediaLibraryGrid({
  assets,
  stats,
  usedUrls,
  usedAssetIds,
}: {
  assets: MediaAsset[]
  stats: Stats
  usedUrls: string[]
  usedAssetIds: number[]
}) {
  const router = useRouter()
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [usage, setUsage] = useState<'all' | 'used' | 'unused'>('all')
  const [editing, setEditing] = useState<MediaAsset | null>(null)
  const [adding, setAdding] = useState(false)

  const usedUrlSet = useMemo(() => new Set(usedUrls), [usedUrls])
  const usedIdSet = useMemo(() => new Set(usedAssetIds), [usedAssetIds])

  function isUsed(asset: MediaAsset) {
    return usedIdSet.has(asset.id) || usedUrlSet.has(asset.url) || usedUrlSet.has(asset.path)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return assets.filter((a) => {
      if (category !== 'all' && a.category !== category) return false
      if (type !== 'all' && a.type !== type) return false
      if (usage === 'used' && !isUsed(a)) return false
      if (usage === 'unused' && isUsed(a)) return false
      if (q) {
        const haystack = [a.title, a.name, a.filename, a.url, a.altText, a.caption, ...a.tags]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, search, category, type, usage, usedUrlSet, usedIdSet])

  const showingForm = adding || editing !== null

  function closeForm() {
    setAdding(false)
    setEditing(null)
    router.refresh()
  }

  const statCards: { label: string; value: number }[] = [
    { label: 'Total Assets', value: stats.total },
    { label: 'Used Assets', value: stats.used },
    { label: 'Unused Assets', value: stats.unused },
    { label: 'Recent Uploads', value: stats.recent },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-serif text-3xl text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAdding(true)
              setEditing(null)
            }}
            className="border border-primary bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5"
          >
            Add Media
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(true)
              setEditing(null)
            }}
            title="Direct file upload activates with Blob storage. Until then this opens Add by URL."
            className="border border-bronze px-5 py-2.5 text-xs uppercase tracking-widest text-gold transition-all hover:-translate-y-0.5 hover:border-gold"
          >
            Upload Image
          </button>
          <div className="ml-auto flex items-center border border-border">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              className={cn(
                'px-3 py-2 text-[10px] uppercase tracking-widest',
                view === 'grid' ? 'bg-secondary text-gold' : 'text-muted-foreground',
              )}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              className={cn(
                'px-3 py-2 text-[10px] uppercase tracking-widest',
                view === 'table' ? 'bg-secondary text-gold' : 'text-muted-foreground',
              )}
            >
              Table
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, filename, tags…"
            aria-label="Search media"
            className="min-w-[220px] flex-1 border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="border border-input bg-secondary px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Categories</option>
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {labelize(c)}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by type"
            className="border border-input bg-secondary px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Types</option>
            {MEDIA_TYPES.map((t) => (
              <option key={t} value={t}>
                {labelize(t)}
              </option>
            ))}
          </select>
          <select
            value={usage}
            onChange={(e) => setUsage(e.target.value as 'all' | 'used' | 'unused')}
            aria-label="Filter by usage"
            className="border border-input bg-secondary px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Used & Unused</option>
            <option value="used">Used only</option>
            <option value="unused">Unused only</option>
          </select>
        </div>
      </div>

      {/* Add/Edit form */}
      {showingForm && (
        <div className="border border-bronze/60 bg-card p-6">
          <h2 className="mb-5 font-serif text-xl text-foreground">
            {editing ? `Editing: ${editing.title || editing.name}` : 'Add Media'}
          </h2>
          <MediaAssetForm asset={editing} onDone={closeForm} onCancel={() => { setAdding(false); setEditing(null) }} />
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <p className="font-serif text-xl text-foreground">No media found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {assets.length === 0
              ? 'The library is empty. Add your first asset with the Add Media button.'
              : 'No assets match the current search or filters.'}
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((a) => (
            <MediaAssetCard
              key={a.id}
              asset={a}
              used={isUsed(a)}
              onEdit={(asset) => {
                setEditing(asset)
                setAdding(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          ))}
        </div>
      ) : (
        <AdminTable headers={['Preview', 'Title', 'Type', 'Category', 'Alt Text', 'Tags', 'Usage', 'Actions']}>
          {filtered.map((a) => {
            const url = a.url || a.path
            return (
              <tr key={a.id}>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden border border-border">
                    <Image
                      src={url || '/placeholder.svg'}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                      unoptimized={!url.startsWith('/')}
                    />
                  </div>
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <p className="truncate text-foreground" title={a.title}>
                    {a.title || a.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground" title={url}>
                    {a.filename || url}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{labelize(a.type)}</td>
                <td className="px-4 py-3 text-muted-foreground">{labelize(a.category)}</td>
                <td className="max-w-[180px] truncate px-4 py-3 text-muted-foreground" title={a.altText}>
                  {a.altText || '—'}
                </td>
                <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground">
                  {a.tags.join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs uppercase tracking-widest', isUsed(a) ? 'text-accent' : 'text-muted-foreground')}>
                    {isUsed(a) ? 'Used' : 'Unused'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CopyButton value={url} label="URL" />
                    <CopyButton value={String(a.id)} label="ID" />
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(a)
                        setAdding(false)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-xs uppercase tracking-widest text-gold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </AdminTable>
      )}
    </div>
  )
}

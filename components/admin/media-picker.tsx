'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { adminListMediaAssets } from '@/app/actions/media'
import type { MediaAsset } from '@/lib/db/schema'
import { CopyButton } from '@/components/admin/copy-button'
import { MediaUploadForm } from '@/components/admin/media-upload-form'
import { MEDIA_CATEGORIES, labelize } from '@/lib/media/constants'
import { cn } from '@/lib/utils'

/**
 * Reusable media picker. Value is the asset URL string, which keeps it
 * compatible with all existing url-based fields (release covers, artist
 * images, settings). The picker resolves and displays the matching asset.
 */
export function MediaPicker({
  label,
  value,
  onChange,
  hint,
  categoryHint,
}: {
  label: string
  value: string
  onChange: (url: string, asset?: MediaAsset) => void
  hint?: string
  categoryHint?: string
}) {
  const [open, setOpen] = useState(false)
  const [assets, setAssets] = useState<MediaAsset[] | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(categoryHint ?? 'all')
  const [loading, setLoading] = useState(false)
  const [uploadMode, setUploadMode] = useState(false)

  useEffect(() => {
    if (!open || assets !== null) return
    setLoading(true)
    adminListMediaAssets()
      .then(setAssets)
      .finally(() => setLoading(false))
  }, [open, assets])

  const selected = useMemo(
    () => assets?.find((a) => a.url === value || a.path === value) ?? null,
    [assets, value],
  )

  const filtered = useMemo(() => {
    if (!assets) return []
    const q = search.trim().toLowerCase()
    return assets.filter((a) => {
      if (category !== 'all' && a.category !== category) return false
      if (q) {
        const haystack = [a.title, a.name, a.filename, a.url, ...a.tags].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [assets, search, category])

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      {/* Selected preview */}
      <div className="flex items-center gap-3 border border-input bg-secondary p-2">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-border bg-background">
          {value ? (
            <Image
              src={value || '/placeholder.svg'}
              alt={selected?.altText || 'Selected image'}
              fill
              className="object-cover"
              sizes="56px"
              unoptimized={!value.startsWith('/')}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] text-muted-foreground">
              None
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-foreground">
            {selected?.title || (value ? value : 'No image selected')}
          </p>
          {value && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <CopyButton value={value} label="Copy URL" />
              {selected && <CopyButton value={String(selected.id)} label="ID" />}
              <a
                href={selected ? `/admin/media?asset=${selected.id}` : '/admin/media'}
                target="_blank"
                rel="noreferrer"
                className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Library
              </a>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="border border-bronze px-3 py-1.5 text-[10px] uppercase tracking-widest text-gold hover:border-gold"
          >
            {open ? 'Close' : value ? 'Change' : 'Choose'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}

      {/* Picker panel */}
      {open && uploadMode && (
        <div className="mt-1 border border-bronze/60 bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-serif text-base text-foreground">Upload New Image</h4>
            <button
              type="button"
              onClick={() => setUploadMode(false)}
              className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Back to library
            </button>
          </div>
          <MediaUploadForm
            defaultCategory={categoryHint}
            onDone={(asset) => {
              setAssets(null) // refetch on next open
              setUploadMode(false)
              setOpen(false)
              onChange(asset.url, asset)
            }}
            onCancel={() => setUploadMode(false)}
          />
        </div>
      )}
      {open && !uploadMode && (
        <div className="mt-1 flex max-h-[420px] flex-col gap-3 overflow-hidden border border-bronze/60 bg-card p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media…"
              aria-label="Search media"
              className="min-w-[160px] flex-1 border border-input bg-secondary px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="border border-input bg-secondary px-2 py-1.5 text-sm text-foreground"
            >
              <option value="all">All Categories</option>
              {MEDIA_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {labelize(c)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setUploadMode(true)}
              className="border border-bronze px-3 py-1.5 text-[10px] uppercase tracking-widest text-gold hover:border-gold"
            >
              Upload New
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-center text-sm text-muted-foreground">Loading media…</p>
            ) : filtered.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No media found. Add assets in the Media Library.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {filtered.map((a) => {
                  const url = a.url || a.path
                  const isSelected = url === value
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onChange(url, a)
                        setOpen(false)
                      }}
                      title={a.title}
                      className={cn(
                        'group relative flex flex-col border text-left transition-colors',
                        isSelected ? 'border-gold' : 'border-border hover:border-bronze',
                      )}
                    >
                      <span className="relative block aspect-square w-full overflow-hidden">
                        <Image
                          src={url || '/placeholder.svg'}
                          alt={a.altText || a.title}
                          fill
                          className="object-cover"
                          sizes="120px"
                          unoptimized={!url.startsWith('/')}
                        />
                      </span>
                      <span className="block truncate px-1.5 py-1 text-[10px] text-muted-foreground group-hover:text-foreground">
                        {a.title || a.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Standalone modal picker returning the full MediaAsset — used by the
 * gallery manager to add library assets to a collection.
 */
export function MediaAssetPickerDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (asset: MediaAsset) => void
}) {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [uploadMode, setUploadMode] = useState(false)

  useEffect(() => {
    if (!open || assets !== null) return
    setLoading(true)
    adminListMediaAssets()
      .then(setAssets)
      .finally(() => setLoading(false))
  }, [open, assets])

  const filtered = useMemo(() => {
    if (!assets) return []
    const q = search.trim().toLowerCase()
    return assets.filter((a) => {
      if (category !== 'all' && a.category !== category) return false
      if (q) {
        const haystack = [a.title, a.name, a.filename, a.url, ...a.tags].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [assets, search, category])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose media asset"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-3 overflow-hidden border border-bronze/60 bg-card p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-lg text-foreground">
            {uploadMode ? 'Upload New Image' : 'Choose from Media Library'}
          </h3>
          <div className="flex items-center gap-2">
            {uploadMode ? (
              <button
                type="button"
                onClick={() => setUploadMode(false)}
                className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Back to library
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setUploadMode(true)}
                className="border border-bronze px-3 py-1.5 text-[10px] uppercase tracking-widest text-gold hover:border-gold"
              >
                Upload New
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
        {uploadMode ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <MediaUploadForm
              onDone={(asset) => {
                setAssets(null) // refetch on next open
                setUploadMode(false)
                onSelect(asset)
              }}
              onCancel={() => setUploadMode(false)}
            />
          </div>
        ) : (
          <>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media…"
            aria-label="Search media"
            className="min-w-[160px] flex-1 border border-input bg-secondary px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="border border-input bg-secondary px-2 py-1.5 text-sm text-foreground"
          >
            <option value="all">All Categories</option>
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {labelize(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-center text-sm text-muted-foreground">Loading media…</p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No media found. Add assets in the Media Library.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {filtered.map((a) => {
                const url = a.url || a.path
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelect(a)}
                    title={a.title}
                    className="group relative flex flex-col border border-border text-left transition-colors hover:border-bronze"
                  >
                    <span className="relative block aspect-square w-full overflow-hidden">
                      <Image
                        src={url || '/placeholder.svg'}
                        alt={a.altText || a.title}
                        fill
                        className="object-cover"
                        sizes="120px"
                        unoptimized={!url.startsWith('/')}
                      />
                    </span>
                    <span className="block truncate px-1.5 py-1 text-[10px] text-muted-foreground group-hover:text-foreground">
                      {a.title || a.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  )
}

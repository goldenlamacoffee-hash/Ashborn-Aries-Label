'use client'

import { useEffect, useRef, useState } from 'react'
import { adminUploadMediaAsset } from '@/app/actions/media'
import type { MediaAsset } from '@/lib/db/schema'
import { AdminField, adminInputClass } from '@/components/admin/admin-ui'
import { MEDIA_CATEGORIES, labelize } from '@/lib/media/constants'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024

function prettySize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function titleFromFilename(name: string) {
  return name
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function MediaUploadForm({
  onDone,
  onCancel,
  defaultCategory = 'other',
}: {
  onDone: (asset: MediaAsset) => void
  onCancel: () => void
  defaultCategory?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(defaultCategory)
  const [tags, setTags] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Revoke the object URL when the preview changes/unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function selectFile(candidate: File) {
    setError(null)
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError('Unsupported file type. Use JPEG, PNG, WebP, GIF, SVG, or AVIF.')
      return
    }
    if (candidate.size > MAX_BYTES) {
      setError(`File is too large (${prettySize(candidate.size)}). Maximum size is 10 MB.`)
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(candidate)
    setFile(candidate)
    setPreviewUrl(url)
    setDims(null)
    if (!title.trim()) setTitle(titleFromFilename(candidate.name))

    // Read intrinsic dimensions client-side.
    const img = new window.Image()
    img.onload = () => setDims({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = url
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) selectFile(dropped)
  }

  async function handleUpload() {
    if (busy) return
    if (!file) {
      setError('Choose an image file first.')
      return
    }
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!altText.trim()) {
      setError('Alt text is required for uploaded images.')
      return
    }
    setBusy(true)
    setError(null)
    const fd = new FormData()
    fd.set('file', file)
    fd.set('title', title.trim())
    fd.set('altText', altText.trim())
    fd.set('caption', caption.trim())
    fd.set('description', description.trim())
    fd.set('category', category)
    fd.set('tags', tags)
    if (dims) {
      fd.set('width', String(dims.width))
      fd.set('height', String(dims.height))
    }
    const result = await adminUploadMediaAsset(fd)
    setBusy(false)
    if (result.ok) {
      onDone(result.asset)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Drop zone / preview */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose or drop an image file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed p-6 text-center transition-colors',
          dragOver ? 'border-gold bg-secondary' : 'border-bronze/60 bg-secondary/50 hover:border-gold',
        )}
      >
        {previewUrl && file ? (
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:text-left">
            {/* Local object URLs can't go through next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Upload preview"
              className="h-32 w-32 shrink-0 border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground" title={file.name}>
                {file.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {prettySize(file.size)}
                {dims ? ` · ${dims.width}×${dims.height}px` : ''}
                {' · '}
                {file.type}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-gold">
                Click or drop to replace
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="font-serif text-lg text-foreground">Drop an image here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse — JPEG, PNG, WebP, GIF, SVG, AVIF · max 10 MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            const picked = e.target.files?.[0]
            if (picked) selectFile(picked)
            e.target.value = ''
          }}
        />
      </div>

      {/* Metadata */}
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Title" id="up-title" hint="Required">
          <input id="up-title" className={adminInputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </AdminField>
        <AdminField label="Alt Text" id="up-alt" hint="Required — describes the image">
          <input id="up-alt" className={adminInputClass} value={altText} onChange={(e) => setAltText(e.target.value)} />
        </AdminField>
        <AdminField label="Category" id="up-category">
          <select id="up-category" className={adminInputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {labelize(c)}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Tags" id="up-tags" hint="Comma separated">
          <input id="up-tags" className={adminInputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
        </AdminField>
        <AdminField label="Caption" id="up-caption">
          <input id="up-caption" className={adminInputClass} value={caption} onChange={(e) => setCaption(e.target.value)} />
        </AdminField>
        <AdminField label="Description" id="up-desc">
          <input id="up-desc" className={adminInputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        </AdminField>
      </div>

      {error && (
        <p role="alert" className="text-xs text-ember">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleUpload}
          disabled={busy || !file}
          className="border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? 'Uploading…' : 'Upload to Library'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import type { MediaAsset } from '@/lib/db/schema'
import { CopyButton } from '@/components/admin/copy-button'
import { labelize } from '@/lib/media/constants'
import { cn } from '@/lib/utils'

export function MediaAssetCard({
  asset,
  used,
  onEdit,
  onSelect,
  selectLabel,
}: {
  asset: MediaAsset
  used: boolean
  onEdit?: (asset: MediaAsset) => void
  onSelect?: (asset: MediaAsset) => void
  selectLabel?: string
}) {
  const url = asset.url || asset.path
  return (
    <figure className="flex flex-col border border-border bg-card">
      <div className="relative aspect-square">
        <Image
          src={url || '/placeholder.svg'}
          alt={asset.altText || asset.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized={!url.startsWith('/')}
        />
        <span
          className={cn(
            'absolute left-2 top-2 border px-1.5 py-0.5 text-[9px] uppercase tracking-widest',
            used
              ? 'border-accent/60 bg-background/80 text-accent'
              : 'border-border bg-background/80 text-muted-foreground',
          )}
        >
          {used ? 'Used' : 'Unused'}
        </span>
      </div>
      <figcaption className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="truncate text-sm text-foreground" title={asset.title}>
            {asset.title || asset.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground" title={asset.filename}>
            {asset.filename || url}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-gold">
            {labelize(asset.category)}
          </span>
          {asset.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <CopyButton value={url} label="URL" />
          <CopyButton value={String(asset.id)} label="ID" />
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(asset)}
              className="ml-auto border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-gold hover:border-gold"
            >
              Edit
            </button>
          )}
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(asset)}
              className="ml-auto border border-primary bg-primary px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground"
            >
              {selectLabel ?? 'Select'}
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {asset.createdAt instanceof Date
            ? asset.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : ''}
        </p>
      </figcaption>
    </figure>
  )
}

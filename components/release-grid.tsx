'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { ReleaseCard } from '@/components/release-card'
import { releaseFilters, type Release, type ReleaseFilter, type ReleaseTag } from '@/lib/data'

function applyFilter(releases: Release[], filter: ReleaseFilter): Release[] {
  if (filter === 'all') return releases
  if (filter === 'album' || filter === 'single') {
    return releases.filter((r) => r.type === filter)
  }
  return releases.filter((r) => r.tags.includes(filter as ReleaseTag))
}

export function ReleaseGrid({ releases }: { releases: Release[] }) {
  const [filter, setFilter] = useState<ReleaseFilter>('all')
  const filtered = useMemo(() => applyFilter(releases, filter), [releases, filter])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter releases">
        {releaseFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'rounded-sm border px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest transition-colors',
              filter === f
                ? 'border-gold bg-primary text-primary-foreground'
                : 'border-bronze/40 text-muted-foreground hover:border-gold/60 hover:text-gold',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-serif text-lg tracking-wide text-muted-foreground">
          Nothing in the vault under this mark yet. New fire is coming.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((release) => (
            <ReleaseCard key={release.slug} release={release} />
          ))}
        </div>
      )}
    </div>
  )
}

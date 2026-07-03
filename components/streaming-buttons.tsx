import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { StreamingLinks } from '@/lib/data'

const services: { key: keyof StreamingLinks; label: string }[] = [
  { key: 'spotify', label: 'Spotify' },
  { key: 'appleMusic', label: 'Apple Music' },
  { key: 'youtube', label: 'YouTube' },
]

export function StreamingButtons({
  links,
  lyricsHref,
  className,
}: {
  links: StreamingLinks
  lyricsHref?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {services.map(({ key, label }) =>
        links[key] ? (
          <Link
            key={key}
            href={links[key] as string}
            className="rounded-sm border border-bronze/50 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-gold transition-colors hover:border-ember/60 hover:text-ember"
          >
            {label}
          </Link>
        ) : null,
      )}
      {lyricsHref && (
        <Link
          href={lyricsHref}
          className="rounded-sm border border-bronze/50 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-gold transition-colors hover:border-ember/60 hover:text-ember"
        >
          Lyrics
        </Link>
      )}
    </div>
  )
}

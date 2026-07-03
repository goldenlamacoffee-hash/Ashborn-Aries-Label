import Link from 'next/link'
import Image from 'next/image'
import type { Release } from '@/lib/data'
import { StreamingButtons } from '@/components/streaming-buttons'

export function ReleaseCard({ release }: { release: Release }) {
  const lyricsHref =
    release.type === 'album' ? `/lyrics/${release.slug}` : `/releases/${release.slug}`

  return (
    <article className="ember-glow group flex flex-col overflow-hidden rounded-sm border border-bronze/40 bg-card">
      <Link
        href={`/releases/${release.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <Image
          src={release.coverImage || '/placeholder.svg'}
          alt={`${release.title} cover art`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-sm border border-bronze/50 bg-background/80 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-gold">
          {release.type}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-lg font-semibold tracking-wide text-foreground">
            <Link href={`/releases/${release.slug}`} className="transition-colors hover:text-gold">
              {release.title}
            </Link>
          </h3>
          <p className="font-sans text-xs uppercase tracking-widest text-gold/80">
            {release.artistName}
          </p>
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            {release.mood}
          </p>
        </div>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          {release.description}
        </p>
        <StreamingButtons links={release.streaming} lyricsHref={lyricsHref} className="mt-auto pt-2" />
      </div>
    </article>
  )
}

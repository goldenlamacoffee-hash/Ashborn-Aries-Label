import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/lib/data'

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="ember-glow group overflow-hidden rounded-sm border border-bronze/40 bg-card">
      <Link href={`/artists/${artist.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={artist.image || '/placeholder.svg'}
            alt={`${artist.name} project visual`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
            <h3 className="font-serif text-xl font-semibold tracking-wide text-gold">
              {artist.name}
            </h3>
            <p className="font-sans text-xs uppercase tracking-widest text-foreground/70">
              {artist.role}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}

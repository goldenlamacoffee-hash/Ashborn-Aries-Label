'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { cn, publicStoryNote } from '@/lib/utils'
import type { Release } from '@/lib/data'
import { BronzePanel } from '@/components/bronze-panel'

export function LyricsArchive({ albums }: { albums: Release[] }) {
  const [query, setQuery] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return albums
      .filter((a) => selectedAlbum === 'all' || a.slug === selectedAlbum)
      .map((album) => ({
        album,
        tracks: album.tracks.filter(
          (t) =>
            q === '' ||
            t.title.toLowerCase().includes(q) ||
            t.storyNote.toLowerCase().includes(q),
        ),
      }))
      .filter((entry) => entry.tracks.length > 0)
  }, [albums, query, selectedAlbum])

  return (
    <div className="flex flex-col gap-10">
      {/* Search + album selector */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="lyrics-search" className="sr-only">
            Search lyrics and stories
          </label>
          <input
            id="lyrics-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks and stories"
            className="h-12 w-full rounded-sm border border-bronze/50 bg-background pl-11 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Select release">
          <button
            type="button"
            onClick={() => setSelectedAlbum('all')}
            aria-pressed={selectedAlbum === 'all'}
            className={cn(
              'rounded-sm border px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest transition-colors',
              selectedAlbum === 'all'
                ? 'border-gold bg-primary text-primary-foreground'
                : 'border-bronze/40 text-muted-foreground hover:border-gold/60 hover:text-gold',
            )}
          >
            All Releases
          </button>
          {albums.map((album) => (
            <button
              key={album.slug}
              type="button"
              onClick={() => setSelectedAlbum(album.slug)}
              aria-pressed={selectedAlbum === album.slug}
              className={cn(
                'rounded-sm border px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest transition-colors',
                selectedAlbum === album.slug
                  ? 'border-gold bg-primary text-primary-foreground'
                  : 'border-bronze/40 text-muted-foreground hover:border-gold/60 hover:text-gold',
              )}
            >
              {album.title}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="py-16 text-center font-serif text-lg tracking-wide text-muted-foreground">
          No verses found under that mark. Try another word.
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {results.map(({ album, tracks }) => (
            <section key={album.slug} aria-labelledby={`album-${album.slug}`}>
              <div className="mb-5 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-bronze/40">
                  <Image
                    src={album.coverImage || '/placeholder.svg'}
                    alt={`${album.title} cover art`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h2
                    id={`album-${album.slug}`}
                    className="font-serif text-xl font-semibold tracking-wide text-gold"
                  >
                    <Link href={`/lyrics/${album.slug}`} className="hover:text-ember">
                      {album.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    {album.artistName} · {album.releaseDate}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {tracks.map((track) => (
                  <BronzePanel key={track.slug} className="p-5">
                    <div className="flex h-full flex-col gap-3">
                      <h3 className="font-serif text-base font-semibold tracking-wide text-foreground">
                        {track.title}
                      </h3>
                      <p className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                        {publicStoryNote(track.storyNote)}
                      </p>
                      <Link
                        href={`/lyrics/${album.slug}/${track.slug}`}
                        className="font-sans text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-ember"
                      >
                        Read Lyrics
                      </Link>
                    </div>
                  </BronzePanel>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

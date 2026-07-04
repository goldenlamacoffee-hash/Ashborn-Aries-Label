import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getLyricAlbums, getReleaseBySlug } from '@/lib/cms'
import { SectionDivider } from '@/components/section-divider'

export async function generateStaticParams() {
  const albums = await getLyricAlbums()
  return albums.map((a) => ({ albumSlug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ albumSlug: string }>
}): Promise<Metadata> {
  const { albumSlug } = await params
  const album = await getReleaseBySlug(albumSlug)
  if (!album) return {}
  return {
    title: `${album.title} — Lyrics & Stories`,
    description: `Lyrics and story notes from ${album.title} by ${album.artistName}.`,
    ...(album.coverImage ? { openGraph: { images: [{ url: album.coverImage }] } } : {}),
  }
}

export default async function AlbumLyricsPage({
  params,
}: {
  params: Promise<{ albumSlug: string }>
}) {
  const { albumSlug } = await params
  const album = await getReleaseBySlug(albumSlug)
  if (!album || album.type !== 'album') notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
      <Link
        href="/lyrics"
        className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
      >
        {'← Lyrics & Stories'}
      </Link>

      <div className="mt-8 flex flex-col items-center gap-6 text-center md:flex-row md:gap-10 md:text-left">
        <div className="ember-glow relative h-40 w-40 shrink-0 overflow-hidden rounded-sm border border-bronze/40">
          <Image
            src={album.coverImage || '/placeholder.svg'}
            alt={`${album.title} cover art`}
            fill
            priority
            sizes="160px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            Album Archive
          </p>
          <h1 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl text-balance">
            {album.title}
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            {album.artistName} · {album.releaseDate}
          </p>
          <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
            {album.description}
          </p>
        </div>
      </div>

      <SectionDivider className="my-12 w-full" />

      <ol className="flex flex-col divide-y divide-bronze/20 rounded-sm border border-bronze/30 bg-card/60">
        {album.tracks.map((track, i) => (
          <li key={track.slug}>
            <Link
              href={`/lyrics/${album.slug}/${track.slug}`}
              className="group flex items-center gap-4 px-4 py-5 transition-colors hover:bg-secondary md:px-6"
            >
              <span className="w-6 shrink-0 font-serif text-sm text-bronze">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-sans text-sm font-medium text-foreground transition-colors group-hover:text-gold">
                  {track.title}
                </span>
                <span className="font-sans text-xs text-muted-foreground">{track.storyNote}</span>
              </div>
              <span className="shrink-0 font-sans text-xs font-semibold uppercase tracking-widest text-gold/70 transition-colors group-hover:text-gold">
                Read
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

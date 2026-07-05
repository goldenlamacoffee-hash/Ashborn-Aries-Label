import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLyricAlbums, getTrack } from '@/lib/cms'
import { publicStoryNote } from '@/lib/utils'
import { SectionDivider } from '@/components/section-divider'
import { BronzePanel } from '@/components/bronze-panel'
import { ShareButtons } from '@/components/share-buttons'
import { StreamingButtons } from '@/components/streaming-buttons'

export async function generateStaticParams() {
  const albums = await getLyricAlbums()
  return albums.flatMap((album) =>
    album.tracks.map((track) => ({ albumSlug: album.slug, trackSlug: track.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ albumSlug: string; trackSlug: string }>
}): Promise<Metadata> {
  const { albumSlug, trackSlug } = await params
  const result = await getTrack(albumSlug, trackSlug)
  if (!result) return {}
  return {
    title: `${result.track.title} — Lyrics`,
    description: publicStoryNote(result.track.storyNote),
    ...(result.release.coverImage
      ? { openGraph: { images: [{ url: result.release.coverImage }] } }
      : {}),
  }
}

export default async function TrackLyricsPage({
  params,
}: {
  params: Promise<{ albumSlug: string; trackSlug: string }>
}) {
  const { albumSlug, trackSlug } = await params
  const result = await getTrack(albumSlug, trackSlug)
  if (!result) notFound()
  const { release, track } = result

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
      <Link
        href={`/lyrics/${release.slug}`}
        className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
      >
        {`← ${release.title}`}
      </Link>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
          {release.artistName} · {release.title}
        </p>
        <h1 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl text-balance">
          {track.title}
        </h1>
        <SectionDivider className="w-full" />
      </div>

      {/* Story note */}
      {publicStoryNote(track.storyNote) && (
        <BronzePanel glow={false} className="mt-10 p-6">
          <h2 className="mb-3 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Story Note
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
            {publicStoryNote(track.storyNote)}
          </p>
        </BronzePanel>
      )}

      {/* Spoken intro */}
      {track.spokenIntro && (
        <p className="mt-10 border-l-2 border-ember/50 pl-4 font-sans text-sm italic leading-relaxed text-muted-foreground">
          {track.spokenIntro}
        </p>
      )}

      {/* Lyrics */}
      <section aria-label="Lyrics" className="mt-10 flex flex-col gap-8">
        {track.lyrics.map((stanza, i) => (
          <p
            key={i}
            className="whitespace-pre-line text-center font-serif text-base leading-loose tracking-wide text-foreground/90 md:text-lg"
          >
            {stanza}
          </p>
        ))}
      </section>

      {/* Spoken outro */}
      {track.spokenOutro && (
        <p className="mt-10 border-l-2 border-ember/50 pl-4 font-sans text-sm italic leading-relaxed text-muted-foreground">
          {track.spokenOutro}
        </p>
      )}

      <SectionDivider className="my-12 w-full" />

      {/* Credits */}
      <section aria-labelledby="track-credits-heading">
        <h2
          id="track-credits-heading"
          className="mb-4 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-gold"
        >
          Credits
        </h2>
        <ul className="flex flex-col gap-2">
          {track.credits.map((line) => (
            <li key={line} className="font-sans text-sm leading-relaxed text-muted-foreground">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-4">
        <StreamingButtons links={release.streaming} />
        <ShareButtons
          title={`${track.title} — ${release.artistName}`}
          path={`/lyrics/${release.slug}/${track.slug}`}
        />
      </div>
    </div>
  )
}

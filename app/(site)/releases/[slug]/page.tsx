import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getReleaseBySlug, getReleases } from '@/lib/cms'
import { StreamingButtons } from '@/components/streaming-buttons'
import { ShareButtons } from '@/components/share-buttons'
import { SectionDivider } from '@/components/section-divider'
import { BronzePanel } from '@/components/bronze-panel'

export async function generateStaticParams() {
  const releases = await getReleases()
  return releases.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const release = await getReleaseBySlug(slug)
  if (!release) return {}
  return {
    title: release.title,
    description: release.description,
    openGraph: { images: [{ url: release.coverImage }] },
  }
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const release = await getReleaseBySlug(slug)
  if (!release) notFound()

  const hasLyricArchive = release.type === 'album'

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
      <Link
        href="/releases"
        className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
      >
        {'← All Releases'}
      </Link>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:gap-14">
        <div className="ember-glow relative aspect-square w-full max-w-sm shrink-0 self-center overflow-hidden rounded-sm border border-bronze/40 md:self-start">
          <Image
            src={release.coverImage || '/placeholder.svg'}
            alt={`${release.title} cover art`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            {release.type} · {release.releaseDate}
          </p>
          <h1 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl text-balance">
            {release.title}
          </h1>
          <Link
            href={`/artists/${release.artistSlug}`}
            className="font-sans text-sm uppercase tracking-widest text-gold transition-colors hover:text-ember"
          >
            {release.artistName}
          </Link>
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            {release.mood}
          </p>
          <p className="font-sans text-sm leading-relaxed text-foreground/80 md:text-base text-pretty">
            {release.description}
          </p>
          {release.story && (
            <p className="border-l-2 border-bronze/50 pl-4 font-sans text-sm italic leading-relaxed text-muted-foreground text-pretty">
              {release.story}
            </p>
          )}
          <StreamingButtons
            links={release.streaming}
            lyricsHref={hasLyricArchive ? `/lyrics/${release.slug}` : undefined}
          />
          <ShareButtons title={`${release.title} — ${release.artistName}`} path={`/releases/${release.slug}`} />
        </div>
      </div>

      <SectionDivider className="my-14 w-full" />

      {/* Tracklist */}
      <section aria-labelledby="tracklist-heading">
        <h2
          id="tracklist-heading"
          className="mb-6 font-serif text-2xl font-semibold uppercase tracking-wide text-gold"
        >
          Tracklist
        </h2>
        <ol className="flex flex-col divide-y divide-bronze/20 rounded-sm border border-bronze/30 bg-card/60">
          {release.tracks.map((track, i) => (
            <li key={track.slug} className="flex items-center gap-4 px-4 py-4 md:px-6">
              <span className="w-6 shrink-0 font-serif text-sm text-bronze">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                {hasLyricArchive ? (
                  <Link
                    href={`/lyrics/${release.slug}/${track.slug}`}
                    className="font-sans text-sm font-medium text-foreground transition-colors hover:text-gold"
                  >
                    {track.title}
                  </Link>
                ) : (
                  <span className="font-sans text-sm font-medium text-foreground">{track.title}</span>
                )}
                <span className="font-sans text-xs text-muted-foreground">{track.storyNote}</span>
              </div>
              {track.duration && (
                <span className="shrink-0 font-sans text-xs text-muted-foreground">
                  {track.duration}
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Credits */}
      <section aria-labelledby="credits-heading" className="mt-14">
        <h2
          id="credits-heading"
          className="mb-6 font-serif text-2xl font-semibold uppercase tracking-wide text-gold"
        >
          Credits
        </h2>
        <BronzePanel glow={false} className="p-6">
          <ul className="flex flex-col gap-2">
            {release.credits.map((line) => (
              <li key={line} className="font-sans text-sm leading-relaxed text-muted-foreground">
                {line}
              </li>
            ))}
          </ul>
        </BronzePanel>
      </section>
    </div>
  )
}

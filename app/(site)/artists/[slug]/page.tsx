import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArtistBySlug, getArtists, getReleasesByArtist } from '@/lib/cms'
import { ReleaseCard } from '@/components/release-card'
import { SectionDivider } from '@/components/section-divider'
import { BronzePanel } from '@/components/bronze-panel'
import { StreamingButtons } from '@/components/streaming-buttons'

export async function generateStaticParams() {
  const artists = await getArtists()
  return artists.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)
  if (!artist) return {}
  return {
    title: artist.name,
    description: artist.tagline,
    ...(artist.image ? { openGraph: { images: [{ url: artist.image }] } } : {}),
  }
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)
  if (!artist) notFound()

  const releases = await getReleasesByArtist(artist.slug)

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
      <Link
        href="/artists"
        className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
      >
        {'← All Artists'}
      </Link>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:gap-14">
        <div className="ember-glow relative aspect-[4/5] w-full max-w-sm shrink-0 self-center overflow-hidden rounded-sm border border-bronze/40 md:self-start">
          <Image
            src={artist.image || '/placeholder.svg'}
            alt={`${artist.name} project visual`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            {artist.role}
          </p>
          <h1 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl text-balance">
            {artist.name}
          </h1>
          <p className="font-serif text-lg italic tracking-wide text-gold/90">{artist.tagline}</p>
          {artist.bio.map((paragraph, i) => (
            <p
              key={i}
              className="font-sans text-sm leading-relaxed text-foreground/80 md:text-base text-pretty"
            >
              {paragraph}
            </p>
          ))}
          <StreamingButtons links={artist.links} />
        </div>
      </div>

      <SectionDivider className="my-14 w-full" />

      {releases.length > 0 && (
        <section aria-labelledby="artist-releases-heading">
          <h2
            id="artist-releases-heading"
            className="mb-6 font-serif text-2xl font-semibold uppercase tracking-wide text-gold"
          >
            Releases
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => (
              <ReleaseCard key={release.slug} release={release} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="press-kit-heading" className="mt-14">
        <h2
          id="press-kit-heading"
          className="mb-6 font-serif text-2xl font-semibold uppercase tracking-wide text-gold"
        >
          Press Kit
        </h2>
        <BronzePanel glow={false} className="p-6">
          <p className="font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
            {artist.pressKitNote}
          </p>
        </BronzePanel>
      </section>
    </div>
  )
}

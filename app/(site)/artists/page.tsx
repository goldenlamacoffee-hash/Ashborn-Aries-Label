import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ArtistCard } from '@/components/artist-card'
import { getArtists } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'The Ashborn Aries Label roster — dark country, sax lounge, and cinematic instrumental projects.',
}

export default async function ArtistsPage() {
  const artists = await getArtists()

  return (
    <>
      <PageHero
        eyebrow="The Roster"
        title="Artists & Projects"
        copy="A growing roster of projects under the ram. Every profile below is an editable placeholder built for future growth — not a real person."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.slug} artist={artist} />
          ))}
        </div>
      </section>
    </>
  )
}

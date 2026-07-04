import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { LyricsArchive } from '@/components/lyrics-archive'
import { getLyricAlbums } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Lyrics & Stories',
  description:
    'The Ashborn Aries Label lyric and story archive — verses, story notes, and spoken words from every album.',
}

export default async function LyricsPage() {
  const albums = await getLyricAlbums()

  return (
    <>
      <PageHero
        eyebrow="The Vault"
        title="Lyrics & Stories"
        copy="Every song carries a story note, and every album is a chapter. Search the archive or walk it album by album. All lyrics shown are editable placeholders until the label sets the final words."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <LyricsArchive albums={albums} />
      </section>
    </>
  )
}

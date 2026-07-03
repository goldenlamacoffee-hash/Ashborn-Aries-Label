import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ReleaseGrid } from '@/components/release-grid'

export const metadata: Metadata = {
  title: 'Releases',
  description:
    'The Ashborn Aries Label catalog — dark country albums, singles, sax lounge, and cinematic instrumental releases.',
}

export default function ReleasesPage() {
  return (
    <>
      <PageHero
        eyebrow="The Catalog"
        title="Releases"
        copy="Albums, singles, and instrumental sessions from the Ashborn Aries vault. Every record is a chapter — filter by form or by fire."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <ReleaseGrid />
      </section>
    </>
  )
}

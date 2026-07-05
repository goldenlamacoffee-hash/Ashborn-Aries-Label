import { adminListReleases, adminListTracks } from '@/app/actions/admin'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { TracksManager, type TrackRow } from '@/components/admin/tracks-manager'

export default async function AdminTracksPage({
  searchParams,
}: {
  searchParams: Promise<{ release?: string }>
}) {
  const { release } = await searchParams
  const initialReleaseFilter = release && /^\d+$/.test(release) ? Number(release) : undefined
  const [trackRows, releaseRows] = await Promise.all([adminListTracks(), adminListReleases()])

  const releaseTitle = new Map(releaseRows.map((r) => [r.id, r.title]))

  const tracks: TrackRow[] = trackRows
    .map((t) => ({
      id: t.id,
      releaseId: t.releaseId,
      slug: t.slug,
      title: t.title,
      trackNumber: t.trackNumber,
      duration: t.duration,
      storyNote: t.storyNote,
      lyricsStanzas: t.lyricsStanzas,
      spokenIntro: t.spokenIntro,
      spokenOutro: t.spokenOutro,
      creditsList: t.creditsList,
      published: t.published,
      updatedAt: t.updatedAt.toISOString(),
    }))
    // Default sort: release title ASC, then trackNumber ASC
    .sort((a, b) => {
      const ra = releaseTitle.get(a.releaseId) ?? ''
      const rb = releaseTitle.get(b.releaseId) ?? ''
      return ra.localeCompare(rb) || a.trackNumber - b.trackNumber
    })

  return (
    <div>
      <AdminPageHeader
        title="Tracks / Lyrics"
        description="Manage track listings, lyrics stanzas, spoken word passages, story notes, and credits."
      />
      <TracksManager
        tracks={tracks}
        releaseOptions={releaseRows.map((r) => ({ id: r.id, title: r.title, slug: r.slug }))}
        initialReleaseFilter={initialReleaseFilter}
      />
    </div>
  )
}

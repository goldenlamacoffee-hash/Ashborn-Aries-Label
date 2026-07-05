import { adminListArtists, adminListReleases, adminListTracks } from '@/app/actions/admin'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { ReleasesManager, type ReleaseRow } from '@/components/admin/releases-manager'
import type { PanelTrack } from '@/components/admin/release-tracks-panel'

export default async function AdminReleasesPage() {
  const [releaseRows, artistRows, trackRows] = await Promise.all([
    adminListReleases(),
    adminListArtists(),
    adminListTracks(),
  ])

  const tracksByRelease: Record<number, PanelTrack[]> = {}
  for (const t of trackRows) {
    ;(tracksByRelease[t.releaseId] ??= []).push({
      id: t.id,
      slug: t.slug,
      title: t.title,
      trackNumber: t.trackNumber,
      published: t.published,
    })
  }

  const releases: ReleaseRow[] = releaseRows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    artistId: r.artistId,
    type: r.type,
    releaseDate: r.releaseDate,
    cover: r.cover,
    description: r.description,
    story: r.story,
    mood: r.mood,
    tags: r.tags,
    credits: r.credits,
    featured: r.featured,
    published: r.published,
    sortOrder: r.sortOrder,
    streamingLinks: r.streamingLinks,
  }))

  return (
    <div>
      <AdminPageHeader
        title="Releases"
        description="Create, edit, publish, and delete releases. Changes go live on the public site immediately."
      />
      <ReleasesManager
        releases={releases}
        artistOptions={artistRows.map((a) => ({ id: a.id, name: a.name }))}
        tracksByRelease={tracksByRelease}
      />
    </div>
  )
}

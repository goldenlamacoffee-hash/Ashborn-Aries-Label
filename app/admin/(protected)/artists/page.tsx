import { adminListArtists } from '@/app/actions/admin'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { ArtistsManager, type ArtistRow } from '@/components/admin/artists-manager'

export default async function AdminArtistsPage() {
  const rows = await adminListArtists()

  const artists: ArtistRow[] = rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    role: a.role,
    tagline: a.tagline,
    bio: a.bio,
    image: a.image,
    links: a.links,
    pressKitNote: a.pressKitNote,
    sortOrder: a.sortOrder,
    published: a.published,
  }))

  return (
    <div>
      <AdminPageHeader
        title="Artists"
        description="Manage the roster: bios, photos, taglines, and links."
      />
      <ArtistsManager artists={artists} />
    </div>
  )
}

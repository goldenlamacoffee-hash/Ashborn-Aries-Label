import { AdminPageHeader } from '@/components/admin/admin-ui'
import { MediaLibraryGrid } from '@/components/admin/media-library-grid'
import { adminGetMediaStats, adminListMediaAssets } from '@/app/actions/media'
import { getUsedAssetKeys } from '@/lib/media/get-media-usage'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage() {
  const [assets, stats, usedKeys] = await Promise.all([
    adminListMediaAssets(),
    adminGetMediaStats(),
    getUsedAssetKeys(),
  ])

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Every visual asset on the site. Add by URL, edit metadata, copy public links, and reuse assets across releases, artists, galleries, and settings."
      />
      <MediaLibraryGrid
        assets={assets}
        stats={stats}
        usedUrls={[...usedKeys.usedUrls]}
        usedAssetIds={[...usedKeys.usedAssetIds]}
      />
    </>
  )
}

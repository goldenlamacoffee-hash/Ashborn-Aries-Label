import type { Metadata } from 'next'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { adminListCollections } from '@/app/actions/media'

export const metadata: Metadata = {
  title: 'Gallery — Admin',
}

export default async function AdminGalleryPage() {
  const collections = await adminListCollections()

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Gallery Collections"
        description="Curate the Visual World page. Group Media Library assets into ordered, publishable collections."
      />
      <GalleryManager collections={collections} />
    </div>
  )
}

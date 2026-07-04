import { getSiteSettings } from '@/lib/cms'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { SettingsForm } from '@/components/admin/settings-form'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Homepage hero text, SEO metadata, contact email, and social links. Saved to the database."
      />
      <SettingsForm initial={settings} />
    </>
  )
}

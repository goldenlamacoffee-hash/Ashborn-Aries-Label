import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSiteSettings } from '@/lib/cms'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings()
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader logoUrl={siteSettings.logoUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

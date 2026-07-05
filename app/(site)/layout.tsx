import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSiteSettings } from '@/lib/cms'

/**
 * ISR for the entire public site: pages re-render from the database at most
 * every 60 seconds. Admin server actions still call revalidatePath() for
 * instant updates on the deployment where the edit happens; this interval
 * guarantees every other deployment (preview vs production share one
 * database) also converges within a minute.
 */
export const revalidate = 60

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

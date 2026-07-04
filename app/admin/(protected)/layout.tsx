import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin CMS',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  return <AdminShell userName={session.user.name || session.user.email}>{children}</AdminShell>
}

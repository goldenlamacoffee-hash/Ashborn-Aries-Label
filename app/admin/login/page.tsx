import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export const metadata = {
  title: 'Admin Login — Ashborn Aries Label',
}

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/admin')

  const { rows } = await pool.query('SELECT 1 FROM "user" LIMIT 1')
  const allowSignUp = rows.length === 0

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-sm border border-border bg-card p-8">
        <Image
          src="/images/brand/brand-seal.webp"
          alt="Ashborn Aries Label brand seal"
          width={72}
          height={72}
          className="rounded-full"
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-display text-lg font-bold uppercase tracking-[0.2em] text-gold">
            Label Admin
          </h1>
          <p className="font-sans text-xs text-muted-foreground">
            Sign in to manage the catalog.
          </p>
        </div>
        <AdminLoginForm allowSignUp={allowSignUp} />
      </div>
    </main>
  )
}

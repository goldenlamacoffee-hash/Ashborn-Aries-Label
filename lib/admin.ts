import 'server-only'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

/** Returns the session user if signed in, otherwise null. */
export async function getAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

/** Throws if the request is not from a signed-in admin user. */
export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

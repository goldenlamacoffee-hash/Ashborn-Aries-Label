// TEMPORARY diagnostic route — simulates an admin mutation (DB write +
// revalidatePath) without auth, only for local production-build testing.
// This file is deleted before the sprint ends.
import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { releases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'disabled' }, { status: 403 })
  }
  const title = request.nextUrl.searchParams.get('title')
  const slug = request.nextUrl.searchParams.get('slug')
  if (!title || !slug) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }
  const [row] = await db
    .update(releases)
    .set({ title, updatedAt: new Date() })
    .where(eq(releases.slug, slug))
    .returning({ id: releases.id, title: releases.title })
  const mode = request.nextUrl.searchParams.get('mode') ?? 'full'
  revalidatePath('/', 'layout')
  if (mode === 'full') {
    revalidatePath('/releases/[slug]', 'page')
    revalidatePath('/artists/[slug]', 'page')
    revalidatePath('/lyrics/[albumSlug]', 'page')
    revalidatePath('/lyrics/[albumSlug]/[trackSlug]', 'page')
  }
  return NextResponse.json({ updated: row ?? null, mode })
}

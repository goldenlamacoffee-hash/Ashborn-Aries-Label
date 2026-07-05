'use server'

import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import {
  artists,
  contactMessages,
  mediaAssets,
  newsletterSubscribers,
  releases,
  siteSettings,
  tracks,
} from '@/lib/db/schema'
import { and, asc, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function revalidateSite() {
  revalidatePath('/', 'layout')
}

// ---------- Releases ----------

export type ReleaseInput = {
  slug: string
  title: string
  artistId: number | null
  type: string
  releaseDate: string
  cover: string
  description: string
  story: string
  mood: string
  tags: string[]
  credits: string[]
  featured: boolean
  published: boolean
  sortOrder: number
  streamingLinks: Record<string, string>
}

export async function adminListReleases() {
  await requireAdmin()
  return db.select().from(releases).orderBy(asc(releases.sortOrder), desc(releases.id))
}

export async function adminCreateRelease(input: ReleaseInput) {
  await requireAdmin()
  const [row] = await db.insert(releases).values(input).returning()
  revalidateSite()
  return row
}

export async function adminUpdateRelease(id: number, input: Partial<ReleaseInput>) {
  await requireAdmin()
  const [row] = await db
    .update(releases)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(releases.id, id))
    .returning()
  revalidateSite()
  return row
}

export async function adminDeleteRelease(id: number) {
  await requireAdmin()
  await db.delete(tracks).where(eq(tracks.releaseId, id))
  await db.delete(releases).where(eq(releases.id, id))
  revalidateSite()
}

// ---------- Tracks ----------

export type TrackInput = {
  releaseId: number
  slug: string
  title: string
  trackNumber: number
  duration: string
  storyNote: string
  lyricsStanzas: string[]
  spokenIntro: string
  spokenOutro: string
  creditsList: string[]
  published: boolean
}

export async function adminListTracks(releaseId?: number) {
  await requireAdmin()
  if (releaseId) {
    return db
      .select()
      .from(tracks)
      .where(eq(tracks.releaseId, releaseId))
      .orderBy(asc(tracks.trackNumber))
  }
  return db.select().from(tracks).orderBy(asc(tracks.releaseId), asc(tracks.trackNumber))
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Validates track input. Throws with a human-readable message on failure.
 * - release must exist
 * - trackNumber must be a positive integer, unique within the release
 * - slug is normalized and must be unique within the release
 */
async function validateTrackInput(input: Partial<TrackInput>, excludeTrackId?: number) {
  if (input.releaseId !== undefined) {
    const [release] = await db
      .select({ id: releases.id })
      .from(releases)
      .where(eq(releases.id, input.releaseId))
    if (!release) throw new Error('Selected release does not exist. Tracks must belong to a release.')
  }
  if (input.trackNumber !== undefined) {
    if (!Number.isInteger(input.trackNumber) || input.trackNumber < 1) {
      throw new Error('Track number must be a positive whole number.')
    }
  }
  if (input.releaseId !== undefined && input.trackNumber !== undefined) {
    const clash = await db
      .select({ id: tracks.id })
      .from(tracks)
      .where(and(eq(tracks.releaseId, input.releaseId), eq(tracks.trackNumber, input.trackNumber)))
    if (clash.some((c) => c.id !== excludeTrackId)) {
      throw new Error(`Track number ${input.trackNumber} is already used in this release.`)
    }
  }
  if (input.releaseId !== undefined && input.slug !== undefined) {
    const slugClash = await db
      .select({ id: tracks.id })
      .from(tracks)
      .where(and(eq(tracks.releaseId, input.releaseId), eq(tracks.slug, input.slug)))
    if (slugClash.some((c) => c.id !== excludeTrackId)) {
      throw new Error('A track with this slug already exists in this release.')
    }
  }
}

export async function adminCreateTrack(input: TrackInput) {
  await requireAdmin()
  const clean = { ...input, slug: slugify(input.slug || input.title) }
  if (!clean.title.trim()) throw new Error('Title is required.')
  if (!clean.slug) throw new Error('Slug is required.')
  if (!clean.releaseId) throw new Error('Tracks must belong to a release.')
  await validateTrackInput(clean)
  const [row] = await db.insert(tracks).values(clean).returning()
  revalidateSite()
  return row
}

export async function adminUpdateTrack(id: number, input: Partial<TrackInput>) {
  await requireAdmin()
  const clean = { ...input }
  if (clean.slug !== undefined) {
    clean.slug = slugify(clean.slug)
    if (!clean.slug) throw new Error('Slug is required.')
  }
  if (clean.releaseId !== undefined && !clean.releaseId) {
    throw new Error('Tracks must belong to a release.')
  }
  // For uniqueness checks we need the effective releaseId/trackNumber
  const [existing] = await db.select().from(tracks).where(eq(tracks.id, id))
  if (!existing) throw new Error('Track not found.')
  await validateTrackInput(
    {
      ...clean,
      releaseId: clean.releaseId ?? existing.releaseId,
      trackNumber: clean.trackNumber ?? existing.trackNumber,
      slug: clean.slug ?? existing.slug,
    },
    id,
  )
  const [row] = await db
    .update(tracks)
    .set({ ...clean, updatedAt: new Date() })
    .where(eq(tracks.id, id))
    .returning()
  revalidateSite()
  return row
}

export async function adminDeleteTrack(id: number) {
  await requireAdmin()
  await db.delete(tracks).where(eq(tracks.id, id))
  revalidateSite()
}

/** Renumber all tracks of a release to match the given ordered list of track ids. */
export async function adminReorderTracks(releaseId: number, orderedTrackIds: number[]) {
  await requireAdmin()
  // Two-phase renumber to avoid transient unique collisions
  for (let i = 0; i < orderedTrackIds.length; i++) {
    await db
      .update(tracks)
      .set({ trackNumber: 1000 + i })
      .where(and(eq(tracks.id, orderedTrackIds[i]), eq(tracks.releaseId, releaseId)))
  }
  for (let i = 0; i < orderedTrackIds.length; i++) {
    await db
      .update(tracks)
      .set({ trackNumber: i + 1, updatedAt: new Date() })
      .where(and(eq(tracks.id, orderedTrackIds[i]), eq(tracks.releaseId, releaseId)))
  }
  revalidateSite()
}

// ---------- Artists ----------

export type ArtistInput = {
  slug: string
  name: string
  role: string
  tagline: string
  bio: string
  image: string
  links: Record<string, string>
  pressKitNote: string
  sortOrder: number
  published: boolean
}

export async function adminListArtists() {
  await requireAdmin()
  return db.select().from(artists).orderBy(asc(artists.sortOrder), asc(artists.id))
}

export async function adminCreateArtist(input: ArtistInput) {
  await requireAdmin()
  const [row] = await db.insert(artists).values(input).returning()
  revalidateSite()
  return row
}

export async function adminUpdateArtist(id: number, input: Partial<ArtistInput>) {
  await requireAdmin()
  const [row] = await db
    .update(artists)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(artists.id, id))
    .returning()
  revalidateSite()
  return row
}

export async function adminDeleteArtist(id: number) {
  await requireAdmin()
  await db.delete(artists).where(eq(artists.id, id))
  revalidateSite()
}

// ---------- Site settings ----------

export async function adminGetSetting(key: string) {
  await requireAdmin()
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1)
  return row?.value ?? null
}

export async function adminSetSetting(key: string, value: Record<string, unknown>) {
  await requireAdmin()
  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    })
  revalidateSite()
}

// ---------- Contact messages ----------

export async function adminListMessages() {
  await requireAdmin()
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt))
}

export async function adminMarkMessageRead(id: number, read: boolean) {
  await requireAdmin()
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id))
  revalidatePath('/admin/messages')
}

export async function adminDeleteMessage(id: number) {
  await requireAdmin()
  await db.delete(contactMessages).where(eq(contactMessages.id, id))
  revalidatePath('/admin/messages')
}

// ---------- Newsletter ----------

export async function adminListSubscribers() {
  await requireAdmin()
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt))
}

export async function adminDeleteSubscriber(id: number) {
  await requireAdmin()
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id))
  revalidatePath('/admin/newsletter')
}

// ---------- Media ----------

export async function adminListMedia() {
  await requireAdmin()
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt))
}

export async function adminAddMedia(input: { path: string; name: string; usage: string }) {
  await requireAdmin()
  const [row] = await db
    .insert(mediaAssets)
    .values(input)
    .onConflictDoUpdate({
      target: mediaAssets.path,
      set: { name: input.name, usage: input.usage },
    })
    .returning()
  revalidatePath('/admin/media')
  return row
}

export async function adminDeleteMedia(id: number) {
  await requireAdmin()
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  revalidatePath('/admin/media')
}

// ---------- Diagnostics ----------

/** Manually purge every public page cache on this deployment. */
export async function adminPublishNow() {
  await requireAdmin()
  revalidateSite()
  return { ok: true, at: new Date().toISOString() }
}

/**
 * Live sync diagnostics: proves reads/writes hit the database and shows
 * when each content type last changed.
 */
export async function adminGetDiagnostics() {
  await requireAdmin()
  const started = Date.now()
  const [releaseRow, trackRow, artistRow, settingRow, mediaRow] = await Promise.all([
    db.select({ at: releases.updatedAt }).from(releases).orderBy(desc(releases.updatedAt)).limit(1),
    db.select({ at: tracks.updatedAt }).from(tracks).orderBy(desc(tracks.updatedAt)).limit(1),
    db.select({ at: artists.updatedAt }).from(artists).orderBy(desc(artists.updatedAt)).limit(1),
    db
      .select({ at: siteSettings.updatedAt })
      .from(siteSettings)
      .orderBy(desc(siteSettings.updatedAt))
      .limit(1),
    db
      .select({ at: mediaAssets.updatedAt })
      .from(mediaAssets)
      .orderBy(desc(mediaAssets.updatedAt))
      .limit(1),
  ])
  return {
    dbLatencyMs: Date.now() - started,
    serverTime: new Date().toISOString(),
    lastUpdated: {
      releases: releaseRow[0]?.at?.toISOString() ?? null,
      tracks: trackRow[0]?.at?.toISOString() ?? null,
      artists: artistRow[0]?.at?.toISOString() ?? null,
      settings: settingRow[0]?.at?.toISOString() ?? null,
      media: mediaRow[0]?.at?.toISOString() ?? null,
    },
  }
}

// ---------- Dashboard stats ----------

export async function adminGetStats() {
  await requireAdmin()
  const [releaseRows, trackRows, artistRows, messageRows, subscriberRows] = await Promise.all([
    db.select({ id: releases.id, published: releases.published }).from(releases),
    db.select({ id: tracks.id }).from(tracks),
    db.select({ id: artists.id }).from(artists),
    db
      .select({ id: contactMessages.id, read: contactMessages.read })
      .from(contactMessages),
    db.select({ id: newsletterSubscribers.id }).from(newsletterSubscribers),
  ])
  return {
    releases: releaseRows.length,
    releasesPublished: releaseRows.filter((r) => r.published).length,
    tracks: trackRows.length,
    artists: artistRows.length,
    messages: messageRows.length,
    messagesUnread: messageRows.filter((m) => !m.read).length,
    subscribers: subscriberRows.length,
  }
}

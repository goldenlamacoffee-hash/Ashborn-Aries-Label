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

export async function adminCreateTrack(input: TrackInput) {
  await requireAdmin()
  const [row] = await db.insert(tracks).values(input).returning()
  revalidateSite()
  return row
}

export async function adminUpdateTrack(id: number, input: Partial<TrackInput>) {
  await requireAdmin()
  const [row] = await db
    .update(tracks)
    .set({ ...input, updatedAt: new Date() })
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

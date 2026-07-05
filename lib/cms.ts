// -----------------------------------------------------------------------------
// Ashborn Aries Label — CMS query layer (Neon + Drizzle)
// Async accessors returning the same shapes the public pages already consume.
// -----------------------------------------------------------------------------
import { and, asc, desc, eq } from 'drizzle-orm'
import { db } from './db'
import {
  artists as artistsTable,
  releases as releasesTable,
  tracks as tracksTable,
  siteSettings as settingsTable,
  galleryCollections as collectionsTable,
  galleryItems as itemsTable,
  mediaAssets as mediaTable,
  type GalleryCollection,
  type GalleryItem,
  type MediaAsset,
} from './db/schema'
import type {
  Artist,
  Release,
  ReleaseFilter,
  ReleaseTag,
  SiteSettings,
  Track,
} from './data'
import { siteSettings as defaultSettings } from './data'

/* ---------------------------------------------------------------- mappers */

type ReleaseRow = typeof releasesTable.$inferSelect
type TrackRow = typeof tracksTable.$inferSelect
type ArtistRow = typeof artistsTable.$inferSelect

function mapTrack(row: TrackRow): Track {
  return {
    slug: row.slug,
    title: row.title,
    duration: row.duration || undefined,
    storyNote: row.storyNote,
    spokenIntro: row.spokenIntro || undefined,
    spokenOutro: row.spokenOutro || undefined,
    lyrics: row.lyricsStanzas,
    credits: row.creditsList,
  }
}

function mapRelease(
  row: ReleaseRow,
  artist: ArtistRow | null,
  trackRows: TrackRow[],
): Release {
  return {
    slug: row.slug,
    title: row.title,
    type: row.type as Release['type'],
    artistSlug: artist?.slug ?? '',
    artistName: artist?.name ?? 'Ashborn Aries Label',
    releaseDate: row.releaseDate,
    mood: row.mood,
    description: row.description,
    story: row.story || undefined,
    coverImage: row.cover,
    tags: row.tags as ReleaseTag[],
    featured: row.featured,
    streaming: row.streamingLinks,
    tracks: trackRows.map(mapTrack),
    credits: row.credits,
  }
}

function mapArtist(row: ArtistRow): Artist {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role,
    tagline: row.tagline,
    bio: row.bio.split('\n\n').filter(Boolean),
    image: row.image,
    links: row.links,
    pressKitNote: row.pressKitNote,
    placeholder: false,
  }
}

/* -------------------------------------------------------------- accessors */

export async function getSiteSettings(): Promise<SiteSettings> {
  const [row] = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, 'site'))
    .limit(1)
  if (!row) return defaultSettings
  return { ...defaultSettings, ...(row.value as Partial<SiteSettings>) }
}

async function loadReleases(where?: ReturnType<typeof eq>): Promise<Release[]> {
  const releaseRows = await db
    .select()
    .from(releasesTable)
    .where(where ? and(eq(releasesTable.published, true), where) : eq(releasesTable.published, true))
    .orderBy(asc(releasesTable.sortOrder), desc(releasesTable.createdAt))
  if (releaseRows.length === 0) return []

  const artistRows = await db.select().from(artistsTable)
  const artistById = new Map(artistRows.map((a) => [a.id, a]))

  const allTracks = await db
    .select()
    .from(tracksTable)
    .where(eq(tracksTable.published, true))
    .orderBy(asc(tracksTable.trackNumber))
  const tracksByRelease = new Map<number, TrackRow[]>()
  for (const t of allTracks) {
    const list = tracksByRelease.get(t.releaseId) ?? []
    list.push(t)
    tracksByRelease.set(t.releaseId, list)
  }

  return releaseRows.map((r) =>
    mapRelease(
      r,
      r.artistId != null ? (artistById.get(r.artistId) ?? null) : null,
      tracksByRelease.get(r.id) ?? [],
    ),
  )
}

export async function getReleases(): Promise<Release[]> {
  return loadReleases()
}

export async function getReleaseBySlug(slug: string): Promise<Release | undefined> {
  const list = await loadReleases(eq(releasesTable.slug, slug))
  return list[0]
}

export async function getFeaturedRelease(): Promise<Release | undefined> {
  const list = await loadReleases()
  return list.find((r) => r.featured) ?? list[0]
}

export async function getReleasesByArtist(artistSlug: string): Promise<Release[]> {
  const list = await loadReleases()
  return list.filter((r) => r.artistSlug === artistSlug)
}

export async function getArtists(): Promise<Artist[]> {
  const rows = await db
    .select()
    .from(artistsTable)
    .where(eq(artistsTable.published, true))
    .orderBy(asc(artistsTable.sortOrder))
  return rows.map(mapArtist)
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
  const rows = await db
    .select()
    .from(artistsTable)
    .where(and(eq(artistsTable.slug, slug), eq(artistsTable.published, true)))
    .limit(1)
  return rows[0] ? mapArtist(rows[0]) : undefined
}

export async function getLyricAlbums(): Promise<Release[]> {
  const list = await loadReleases()
  // Include every published release (album, single, EP, instrumental, etc.)
  // that has at least one published track. loadReleases() already filters to
  // published releases with only published tracks attached, so we just drop
  // releases with no lyric/track content.
  return list.filter((r) => r.tracks.length > 0)
}

export async function getTrack(
  albumSlug: string,
  trackSlug: string,
): Promise<{ release: Release; track: Track } | undefined> {
  const release = await getReleaseBySlug(albumSlug)
  if (!release) return undefined
  const track = release.tracks.find((t) => t.slug === trackSlug)
  if (!track) return undefined
  return { release, track }
}

/* ---------------------------------------------------------------- gallery */

export type PublicGalleryItem = GalleryItem & { asset: MediaAsset }
export type PublicGalleryCollection = GalleryCollection & { items: PublicGalleryItem[] }

export async function getPublishedGalleryCollections(): Promise<PublicGalleryCollection[]> {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.isPublished, true))
    .orderBy(asc(collectionsTable.sortOrder), asc(collectionsTable.id))
  if (collections.length === 0) return []

  const [items, assets] = await Promise.all([
    db
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.isVisible, true))
      .orderBy(asc(itemsTable.sortOrder), asc(itemsTable.id)),
    db.select().from(mediaTable),
  ])
  const assetById = new Map(assets.map((a) => [a.id, a]))

  return collections.map((collection) => ({
    ...collection,
    items: items
      .filter((item) => item.collectionId === collection.id)
      .flatMap((item) => {
        const asset = assetById.get(item.mediaAssetId)
        return asset && asset.isPublic ? [{ ...item, asset }] : []
      }),
  }))
}

export async function filterReleasesAsync(filter: ReleaseFilter): Promise<Release[]> {
  const list = await loadReleases()
  if (filter === 'all') return list
  if (filter === 'album' || filter === 'single') {
    return list.filter((r) => r.type === filter)
  }
  return list.filter((r) => r.tags.includes(filter as ReleaseTag))
}

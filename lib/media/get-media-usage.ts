import { db } from '@/lib/db'
import {
  artists,
  galleryCollections,
  galleryItems,
  releases,
  siteSettings,
  type MediaAsset,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type MediaUsage = {
  entityType: 'release' | 'artist' | 'setting' | 'gallery'
  entityTitle: string
  field: string
  adminHref: string
  publicHref?: string
}

/**
 * Finds everywhere a media asset is referenced. References are matched by
 * asset URL (releases.cover, artists.image, site settings values) and by
 * asset id (gallery_items.media_asset_id).
 */
export async function getMediaUsage(asset: MediaAsset): Promise<MediaUsage[]> {
  const usages: MediaUsage[] = []
  const url = asset.url || asset.path

  const [releaseRows, artistRows, settingRows, itemRows] = await Promise.all([
    db
      .select({ id: releases.id, title: releases.title, slug: releases.slug, cover: releases.cover })
      .from(releases),
    db
      .select({ id: artists.id, name: artists.name, slug: artists.slug, image: artists.image })
      .from(artists),
    db.select({ key: siteSettings.key, value: siteSettings.value }).from(siteSettings),
    db
      .select({
        id: galleryItems.id,
        collectionId: galleryItems.collectionId,
        mediaAssetId: galleryItems.mediaAssetId,
      })
      .from(galleryItems)
      .where(eq(galleryItems.mediaAssetId, asset.id)),
  ])

  for (const r of releaseRows) {
    if (r.cover === url) {
      usages.push({
        entityType: 'release',
        entityTitle: r.title,
        field: 'Cover image',
        adminHref: '/admin/releases',
        publicHref: `/releases/${r.slug}`,
      })
    }
  }

  for (const a of artistRows) {
    if (a.image === url) {
      usages.push({
        entityType: 'artist',
        entityTitle: a.name,
        field: 'Artist image',
        adminHref: '/admin/artists',
        publicHref: `/artists/${a.slug}`,
      })
    }
  }

  for (const s of settingRows) {
    const json = JSON.stringify(s.value)
    if (url && json.includes(url)) {
      usages.push({
        entityType: 'setting',
        entityTitle: `Site settings (${s.key})`,
        field: 'Settings value',
        adminHref: '/admin/settings',
      })
    }
  }

  if (itemRows.length > 0) {
    const collections = await db
      .select({ id: galleryCollections.id, title: galleryCollections.title })
      .from(galleryCollections)
    const byId = new Map(collections.map((c) => [c.id, c.title]))
    for (const item of itemRows) {
      usages.push({
        entityType: 'gallery',
        entityTitle: byId.get(item.collectionId) ?? `Collection #${item.collectionId}`,
        field: 'Gallery item',
        adminHref: '/admin/gallery',
        publicHref: '/visual-world',
      })
    }
  }

  return usages
}

/** Returns the set of asset ids/urls that are used anywhere (for stats + badges). */
export async function getUsedAssetKeys(): Promise<{
  usedUrls: Set<string>
  usedAssetIds: Set<number>
}> {
  const [releaseRows, artistRows, settingRows, itemRows] = await Promise.all([
    db.select({ cover: releases.cover }).from(releases),
    db.select({ image: artists.image }).from(artists),
    db.select({ value: siteSettings.value }).from(siteSettings),
    db.select({ mediaAssetId: galleryItems.mediaAssetId }).from(galleryItems),
  ])

  const usedUrls = new Set<string>()
  for (const r of releaseRows) if (r.cover) usedUrls.add(r.cover)
  for (const a of artistRows) if (a.image) usedUrls.add(a.image)
  for (const s of settingRows) {
    const value = s.value as Record<string, unknown>
    for (const v of Object.values(value)) {
      if (typeof v === 'string' && (v.startsWith('/') || v.startsWith('http'))) {
        usedUrls.add(v)
      }
    }
  }

  const usedAssetIds = new Set<number>(itemRows.map((i) => i.mediaAssetId))
  return { usedUrls, usedAssetIds }
}

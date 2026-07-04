'use server'

import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import {
  galleryCollections,
  galleryItems,
  mediaAssets,
  type GalleryCollection,
  type GalleryItem,
  type MediaAsset,
} from '@/lib/db/schema'
import {
  blobConfigured,
  detectProvider,
  filenameFromUrl,
  isValidAssetUrl,
  uploadFile,
} from '@/lib/media/storage'
import { getMediaUsage, getUsedAssetKeys, type MediaUsage } from '@/lib/media/get-media-usage'
import { asc, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

function revalidateMedia() {
  revalidatePath('/admin/media')
  revalidatePath('/admin/gallery')
  revalidatePath('/', 'layout')
}

/* ------------------------------------------------------------------ */
/* Media assets                                                        */
/* ------------------------------------------------------------------ */

const mediaInputSchema = z
  .object({
    url: z.string().min(1, 'Image URL is required.'),
    title: z.string().min(1, 'Title is required.'),
    altText: z.string().default(''),
    caption: z.string().default(''),
    description: z.string().default(''),
    category: z.string().min(1, 'Category is required.'),
    type: z.string().default('image'),
    tags: z.array(z.string()).default([]),
    isPublic: z.boolean().default(true),
  })
  .superRefine((val, ctx) => {
    if (!isValidAssetUrl(val.url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: 'URL must be a valid http(s) URL or a local /path.',
      })
    }
    if (val.isPublic && val.type === 'image' && !val.altText.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['altText'],
        message: 'Alt text is required for public images.',
      })
    }
  })

export type MediaInput = z.input<typeof mediaInputSchema>

export type MediaActionResult =
  | { ok: true; asset: MediaAsset }
  | { ok: false; error: string }

export async function adminListMediaAssets(): Promise<MediaAsset[]> {
  await requireAdmin()
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt))
}

export async function adminGetMediaStats() {
  await requireAdmin()
  const [assets, { usedUrls, usedAssetIds }] = await Promise.all([
    db.select().from(mediaAssets),
    getUsedAssetKeys(),
  ])
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const used = assets.filter(
    (a) => usedAssetIds.has(a.id) || usedUrls.has(a.url) || usedUrls.has(a.path),
  )
  return {
    total: assets.length,
    used: used.length,
    unused: assets.length - used.length,
    recent: assets.filter((a) => a.createdAt.getTime() > oneWeekAgo).length,
  }
}

const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
])
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10 MB

export type UploadResult =
  | { ok: true; asset: MediaAsset }
  | { ok: false; error: string }

/** Whether direct file upload is available (Blob storage configured). */
export async function adminUploadAvailable(): Promise<boolean> {
  await requireAdmin()
  return blobConfigured()
}

/**
 * Upload an image file to Blob storage and register it in the media library.
 * Expects FormData with: file, title, altText, caption, description,
 * category, tags (comma separated), width, height (optional, from client).
 */
export async function adminUploadMediaAsset(formData: FormData): Promise<UploadResult> {
  await requireAdmin()

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'No file provided.' }
  }
  if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return { ok: false, error: 'Unsupported file type. Use JPEG, PNG, WebP, GIF, SVG, or AVIF.' }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: 'File is too large. Maximum size is 10 MB.' }
  }

  const meta = z
    .object({
      title: z.string().min(1, 'Title is required.'),
      altText: z.string().default(''),
      caption: z.string().default(''),
      description: z.string().default(''),
      category: z.string().min(1, 'Category is required.'),
      tags: z.string().default(''),
      width: z.coerce.number().int().positive().optional(),
      height: z.coerce.number().int().positive().optional(),
    })
    .safeParse({
      title: formData.get('title') ?? '',
      altText: formData.get('altText') ?? '',
      caption: formData.get('caption') ?? '',
      description: formData.get('description') ?? '',
      category: formData.get('category') ?? '',
      tags: formData.get('tags') ?? '',
      width: formData.get('width') || undefined,
      height: formData.get('height') || undefined,
    })
  if (!meta.success) {
    return { ok: false, error: meta.error.issues[0]?.message ?? 'Invalid input.' }
  }
  const data = meta.data
  if (!data.altText.trim()) {
    return { ok: false, error: 'Alt text is required for uploaded images.' }
  }

  let stored
  try {
    stored = await uploadFile(file)
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Upload failed. Please try again.',
    }
  }

  try {
    const [row] = await db
      .insert(mediaAssets)
      .values({
        path: stored.url,
        name: data.title,
        url: stored.url,
        title: data.title,
        filename: filenameFromUrl(stored.url),
        originalFilename: file.name,
        type: 'image',
        mimeType: file.type,
        category: data.category,
        altText: data.altText,
        caption: data.caption,
        description: data.description,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        width: data.width ?? null,
        height: data.height ?? null,
        fileSize: file.size,
        source: 'upload',
        storageProvider: 'blob',
        isPublic: true,
      })
      .returning()
    revalidateMedia()
    return { ok: true, asset: row }
  } catch {
    // Registration failed after the file was stored — clean up the blob.
    try {
      const { del } = await import('@vercel/blob')
      await del(stored.url)
    } catch {
      // best-effort cleanup
    }
    return { ok: false, error: 'Save failed. An asset with this URL may already exist.' }
  }
}

export async function adminCreateMediaAsset(input: MediaInput): Promise<MediaActionResult> {
  await requireAdmin()
  const parsed = mediaInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }
  const data = parsed.data
  const filename = filenameFromUrl(data.url)
  try {
    const [row] = await db
      .insert(mediaAssets)
      .values({
        path: data.url,
        name: data.title,
        url: data.url,
        title: data.title,
        filename,
        originalFilename: filename,
        type: data.type,
        category: data.category,
        altText: data.altText,
        caption: data.caption,
        description: data.description,
        tags: data.tags,
        source: data.url.startsWith('/') ? 'local' : 'url',
        storageProvider: detectProvider(data.url),
        isPublic: data.isPublic,
      })
      .returning()
    revalidateMedia()
    return { ok: true, asset: row }
  } catch {
    return { ok: false, error: 'Save failed. An asset with this URL may already exist.' }
  }
}

export async function adminUpdateMediaAsset(
  id: number,
  input: MediaInput,
): Promise<MediaActionResult> {
  await requireAdmin()
  const parsed = mediaInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }
  const data = parsed.data
  try {
    const [row] = await db
      .update(mediaAssets)
      .set({
        path: data.url,
        name: data.title,
        url: data.url,
        title: data.title,
        filename: filenameFromUrl(data.url),
        type: data.type,
        category: data.category,
        altText: data.altText,
        caption: data.caption,
        description: data.description,
        tags: data.tags,
        storageProvider: detectProvider(data.url),
        isPublic: data.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(mediaAssets.id, id))
      .returning()
    revalidateMedia()
    return { ok: true, asset: row }
  } catch {
    return { ok: false, error: 'Update failed. An asset with this URL may already exist.' }
  }
}

export async function adminGetMediaAssetUsage(id: number): Promise<MediaUsage[]> {
  await requireAdmin()
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  if (!asset) return []
  return getMediaUsage(asset)
}

export async function adminDeleteMediaAsset(
  id: number,
  options?: { force?: boolean },
): Promise<{ ok: boolean; error?: string; usages?: MediaUsage[] }> {
  await requireAdmin()
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  if (!asset) return { ok: false, error: 'Asset not found.' }

  const usages = await getMediaUsage(asset)
  if (usages.length > 0 && !options?.force) {
    return { ok: false, error: 'Asset is in use.', usages }
  }

  await db.delete(galleryItems).where(eq(galleryItems.mediaAssetId, id))
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))

  // Remove the underlying file from Blob storage when we own it.
  if (asset.storageProvider === 'blob' && blobConfigured()) {
    try {
      const { del } = await import('@vercel/blob')
      await del(asset.url)
    } catch {
      // best-effort cleanup; the DB record is already gone
    }
  }

  revalidateMedia()
  return { ok: true }
}

/* ------------------------------------------------------------------ */
/* Gallery collections                                                 */
/* ------------------------------------------------------------------ */

const collectionSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().default(''),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export type CollectionInput = z.input<typeof collectionSchema>

export async function adminListCollections(): Promise<GalleryCollection[]> {
  await requireAdmin()
  return db
    .select()
    .from(galleryCollections)
    .orderBy(asc(galleryCollections.sortOrder), asc(galleryCollections.id))
}

export async function adminCreateCollection(
  input: CollectionInput,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin()
  const parsed = collectionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message }
  try {
    await db.insert(galleryCollections).values(parsed.data)
    revalidateMedia()
    return { ok: true }
  } catch {
    return { ok: false, error: 'Create failed. The slug may already exist.' }
  }
}

export async function adminUpdateCollection(
  id: number,
  input: CollectionInput,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin()
  const parsed = collectionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message }
  try {
    await db
      .update(galleryCollections)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(galleryCollections.id, id))
    revalidateMedia()
    return { ok: true }
  } catch {
    return { ok: false, error: 'Update failed. The slug may already exist.' }
  }
}

export async function adminDeleteCollection(id: number) {
  await requireAdmin()
  await db.delete(galleryItems).where(eq(galleryItems.collectionId, id))
  await db.delete(galleryCollections).where(eq(galleryCollections.id, id))
  revalidateMedia()
}

/* ------------------------------------------------------------------ */
/* Gallery items                                                       */
/* ------------------------------------------------------------------ */

export type GalleryItemWithAsset = GalleryItem & { asset: MediaAsset | null }

export async function adminListGalleryItems(
  collectionId: number,
): Promise<GalleryItemWithAsset[]> {
  await requireAdmin()
  const items = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.collectionId, collectionId))
    .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id))
  const assets = await db.select().from(mediaAssets)
  const byId = new Map(assets.map((a) => [a.id, a]))
  return items.map((item) => ({ ...item, asset: byId.get(item.mediaAssetId) ?? null }))
}

export async function adminAddGalleryItem(input: {
  collectionId: number
  mediaAssetId: number
  title?: string
  caption?: string
  linkUrl?: string
}) {
  await requireAdmin()
  const existing = await db
    .select({ sortOrder: galleryItems.sortOrder })
    .from(galleryItems)
    .where(eq(galleryItems.collectionId, input.collectionId))
  const nextOrder = existing.reduce((max, i) => Math.max(max, i.sortOrder), 0) + 1
  await db.insert(galleryItems).values({
    collectionId: input.collectionId,
    mediaAssetId: input.mediaAssetId,
    title: input.title ?? '',
    caption: input.caption ?? '',
    linkUrl: input.linkUrl ?? '',
    sortOrder: nextOrder,
  })
  revalidateMedia()
}

export async function adminUpdateGalleryItem(
  id: number,
  input: Partial<{
    title: string
    caption: string
    linkUrl: string
    sortOrder: number
    isVisible: boolean
  }>,
) {
  await requireAdmin()
  await db
    .update(galleryItems)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(galleryItems.id, id))
  revalidateMedia()
}

export async function adminReorderGalleryItems(orderedIds: number[]) {
  await requireAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(galleryItems)
        .set({ sortOrder: index + 1, updatedAt: new Date() })
        .where(eq(galleryItems.id, id)),
    ),
  )
  revalidateMedia()
}

export async function adminRemoveGalleryItem(id: number) {
  await requireAdmin()
  await db.delete(galleryItems).where(eq(galleryItems.id, id))
  revalidateMedia()
}

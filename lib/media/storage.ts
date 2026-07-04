/**
 * Storage abstraction for the media library.
 *
 * Providers:
 * - "public"  — files that live in /public (local paths like /images/...)
 * - "remote"  — external URLs added via "Add by URL"
 * - "blob"    — Vercel Blob (activates automatically once
 *               BLOB_READ_WRITE_TOKEN is configured)
 */

export type StorageProvider = 'public' | 'remote' | 'blob'

export type StoredFile = {
  url: string
  provider: StorageProvider
  filename: string
}

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/** Decide the provider for a given asset URL. */
export function detectProvider(url: string): StorageProvider {
  if (url.startsWith('/')) return 'public'
  if (url.includes('.blob.vercel-storage.com')) return 'blob'
  return 'remote'
}

export function filenameFromUrl(url: string): string {
  try {
    const path = url.startsWith('/') ? url : new URL(url).pathname
    const last = path.split('/').filter(Boolean).pop() ?? ''
    return decodeURIComponent(last)
  } catch {
    return url.split('/').filter(Boolean).pop() ?? ''
  }
}

export function isValidAssetUrl(url: string): boolean {
  if (!url.trim()) return false
  if (url.startsWith('/')) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Upload a file. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set;
 * otherwise callers should fall back to "Add by URL".
 */
export async function uploadFile(file: File): Promise<StoredFile> {
  if (!blobConfigured()) {
    throw new Error(
      'File upload storage is not configured yet. Add the Blob integration (BLOB_READ_WRITE_TOKEN) or use "Add by URL".',
    )
  }
  const { put } = await import('@vercel/blob')
  const result = await put(`media/${Date.now()}-${file.name}`, file, {
    access: 'public',
  })
  return { url: result.url, provider: 'blob', filename: file.name }
}

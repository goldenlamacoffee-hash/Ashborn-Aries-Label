export const MEDIA_CATEGORIES = [
  'logo',
  'emblem',
  'album-cover',
  'artist-image',
  'hero-background',
  'section-background',
  'gallery',
  'marketing',
  'merch',
  'texture',
  'seo-og',
  'icon',
  'other',
] as const

export const MEDIA_TYPES = [
  'image',
  'logo',
  'texture',
  'document',
  'video-placeholder',
  'other',
] as const

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]
export type MediaType = (typeof MEDIA_TYPES)[number]

export function labelize(value: string): string {
  return value
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

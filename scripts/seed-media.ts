/**
 * Idempotent media library seed.
 * Run: pnpm exec tsx --env-file=/vercel/share/.env.project scripts/seed-media.ts
 */
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

type SeedAsset = {
  url: string
  title: string
  altText: string
  category: string
  type: string
  tags: string[]
}

const assets: SeedAsset[] = [
  { url: '/images/brand/brand-seal.webp', title: 'Brand seal', altText: 'Ashborn Aries Label circular brand seal with ram emblem', category: 'logo', type: 'logo', tags: ['brand', 'seal', 'logo'] },
  { url: '/images/brand/ram-emblem-large.webp', title: 'Ram emblem (large)', altText: 'Large bronze ram emblem on dark background', category: 'emblem', type: 'logo', tags: ['brand', 'ram', 'emblem'] },
  { url: '/images/brand/hero-wide.webp', title: 'Hero artwork (wide)', altText: 'Wide dark hero artwork with ember glow and ram silhouette', category: 'hero-background', type: 'image', tags: ['hero', 'homepage'] },
  { url: '/images/brand/hero-square.webp', title: 'Hero artwork (square)', altText: 'Square dark brand artwork used for social sharing', category: 'seo-og', type: 'image', tags: ['og', 'social'] },
  { url: '/images/covers/ex-igne-et-dolore.png', title: 'Ex Igne et Dolore — cover', altText: 'Ex Igne et Dolore album cover, fire and ash imagery', category: 'album-cover', type: 'image', tags: ['album', 'cover', 'dark-country'] },
  { url: '/images/covers/black-ink-salvation.png', title: 'Black Ink Salvation — cover', altText: 'Black Ink Salvation album cover with tattoo linework', category: 'album-cover', type: 'image', tags: ['album', 'cover', 'dark-country'] },
  { url: '/images/covers/still-standing-in-the-fire.png', title: 'Still Standing in the Fire — cover', altText: 'Still Standing in the Fire single cover, figure in flames', category: 'album-cover', type: 'image', tags: ['single', 'cover', 'dark-country'] },
  { url: '/images/covers/afterglow-sax.png', title: 'Afterglow — cover', altText: 'Afterglow saxophone album cover in warm dusk tones', category: 'album-cover', type: 'image', tags: ['album', 'cover', 'sax'] },
  { url: '/images/covers/velvet-rain-sax.png', title: 'Velvet Rain — cover', altText: 'Velvet Rain saxophone album cover with rain-lit night street', category: 'album-cover', type: 'image', tags: ['album', 'cover', 'sax'] },
  { url: '/images/covers/morning-glow-sax.png', title: 'Morning Glow — cover', altText: 'Morning Glow saxophone album cover with sunrise haze', category: 'album-cover', type: 'image', tags: ['album', 'cover', 'sax'] },
  { url: '/images/artists/ashborn-aries.png', title: 'Ashborn Aries — artist image', altText: 'Ashborn Aries artist portrait in dark ember light', category: 'artist-image', type: 'image', tags: ['artist'] },
  { url: '/images/artists/golden-lama-sax.png', title: 'Golden Lama Sax — artist image', altText: 'Golden Lama Sax project visual with saxophone silhouette', category: 'artist-image', type: 'image', tags: ['artist'] },
  { url: '/images/artists/ashborn-instrumentals.png', title: 'Ashborn Instrumentals — artist image', altText: 'Ashborn Instrumentals project visual with dark textures', category: 'artist-image', type: 'image', tags: ['artist'] },
  { url: '/images/visual/fire-ash.png', title: 'Fire & Ash', altText: 'Glowing embers seeping through cracked charred wood', category: 'gallery', type: 'image', tags: ['visual-world', 'texture'] },
  { url: '/images/visual/black-road.png', title: 'The Black Road', altText: 'Empty black road at night with a faint ember glow on the horizon', category: 'gallery', type: 'image', tags: ['visual-world'] },
  { url: '/images/visual/tattoo-marks.png', title: 'Ink & Marks', altText: 'Black traditional tattoo flash linework of horns, thorns and flames on aged paper', category: 'gallery', type: 'image', tags: ['visual-world', 'tattoo'] },
  { url: '/images/visual/bronze-ember.png', title: 'Bronze & Ember', altText: 'Antique bronze metallic texture fading into charcoal shadow with floating embers', category: 'gallery', type: 'image', tags: ['visual-world', 'texture'] },
]

const collections = [
  { slug: 'brand-identity', title: 'Brand Identity', description: 'Logos, seals and emblem marks of the label.', sortOrder: 1 },
  { slug: 'album-covers', title: 'Album Covers', description: 'Cover artwork for every release in the catalog.', sortOrder: 2 },
  { slug: 'website-visuals', title: 'Website Visuals', description: 'The visual world — fire, roads, ink and bronze.', sortOrder: 3 },
  { slug: 'marketing-assets', title: 'Marketing Assets', description: 'Social, press and promotional imagery.', sortOrder: 4 },
  { slug: 'textures-materials', title: 'Textures & Materials', description: 'Charred wood, bronze patina, ash and ember textures.', sortOrder: 5 },
  { slug: 'merch-mockups', title: 'Merch Mockups', description: 'Merchandise previews and mockups.', sortOrder: 6 },
]

const collectionAssignments: Record<string, string[]> = {
  'brand-identity': ['/images/brand/brand-seal.webp', '/images/brand/ram-emblem-large.webp'],
  'album-covers': [
    '/images/covers/ex-igne-et-dolore.png',
    '/images/covers/black-ink-salvation.png',
    '/images/covers/still-standing-in-the-fire.png',
    '/images/covers/afterglow-sax.png',
    '/images/covers/velvet-rain-sax.png',
    '/images/covers/morning-glow-sax.png',
  ],
  'website-visuals': [
    '/images/visual/fire-ash.png',
    '/images/visual/black-road.png',
    '/images/visual/tattoo-marks.png',
    '/images/visual/bronze-ember.png',
  ],
}

const galleryCaptions: Record<string, string> = {
  '/images/visual/fire-ash.png':
    'Everything we release passes through fire. What survives is what we keep — the ember beneath the char, the glow that refuses to die.',
  '/images/visual/black-road.png':
    'The long road at night is where our stories live. Lonely, unlit, honest. You walk it alone, but the horizon always burns.',
  '/images/visual/tattoo-marks.png':
    'Ink is memory that cannot be erased. Ram horns, thorns, flame and arrow — the marks we carry are the songs we sing.',
  '/images/visual/bronze-ember.png':
    'Our metal is not polished gold. It is weathered bronze — beaten, aged, and warm. Light that earned its patina.',
}

async function main() {
  // 1. Media assets (upsert by path)
  for (const a of assets) {
    const filename = a.url.split('/').pop() ?? ''
    await pool.query(
      `INSERT INTO media_assets
        (path, name, url, title, filename, original_filename, type, category, alt_text, tags, source, storage_provider, is_public)
       VALUES ($1,$2,$1,$2,$3,$3,$4,$5,$6,$7,'local','public',true)
       ON CONFLICT (path) DO UPDATE SET
         url = EXCLUDED.url,
         title = EXCLUDED.title,
         name = EXCLUDED.name,
         filename = EXCLUDED.filename,
         type = EXCLUDED.type,
         category = EXCLUDED.category,
         alt_text = CASE WHEN media_assets.alt_text = '' THEN EXCLUDED.alt_text ELSE media_assets.alt_text END,
         tags = CASE WHEN media_assets.tags = '[]'::jsonb THEN EXCLUDED.tags ELSE media_assets.tags END,
         updated_at = now()`,
      [a.url, a.title, filename, a.type, a.category, a.altText, JSON.stringify(a.tags)],
    )
  }
  console.log(`Seeded ${assets.length} media assets`)

  // 2. Gallery collections (upsert by slug)
  for (const c of collections) {
    await pool.query(
      `INSERT INTO gallery_collections (slug, title, description, sort_order)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = CASE WHEN gallery_collections.description = '' THEN EXCLUDED.description ELSE gallery_collections.description END,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()`,
      [c.slug, c.title, c.description, c.sortOrder],
    )
  }
  console.log(`Seeded ${collections.length} gallery collections`)

  // 3. Gallery items (insert only if missing)
  for (const [slug, urls] of Object.entries(collectionAssignments)) {
    const { rows: colRows } = await pool.query(
      'SELECT id FROM gallery_collections WHERE slug = $1',
      [slug],
    )
    const collectionId = colRows[0]?.id
    if (!collectionId) continue
    let order = 0
    for (const url of urls) {
      order += 1
      const { rows: assetRows } = await pool.query(
        'SELECT id, title FROM media_assets WHERE path = $1',
        [url],
      )
      const asset = assetRows[0]
      if (!asset) continue
      const { rows: existing } = await pool.query(
        'SELECT id FROM gallery_items WHERE collection_id = $1 AND media_asset_id = $2',
        [collectionId, asset.id],
      )
      if (existing.length > 0) continue
      await pool.query(
        `INSERT INTO gallery_items (collection_id, media_asset_id, title, caption, sort_order)
         VALUES ($1,$2,$3,$4,$5)`,
        [collectionId, asset.id, asset.title.replace(/ — .*$/, ''), galleryCaptions[url] ?? '', order],
      )
    }
  }
  console.log('Seeded gallery items')

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

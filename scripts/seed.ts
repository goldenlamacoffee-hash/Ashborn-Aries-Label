// Seed script — migrates the static content from lib/data.ts into Neon.
// Run: pnpm exec tsx --env-file=/vercel/share/.env.project scripts/seed.ts
import { db, pool } from '../lib/db'
import {
  artists as artistsTable,
  releases as releasesTable,
  tracks as tracksTable,
  siteSettings as settingsTable,
  mediaAssets,
} from '../lib/db/schema'
import { artists, releases, siteSettings } from '../lib/data'

async function seed() {
  console.log('[v0] Seeding artists...')
  const artistIds = new Map<string, number>()
  for (let i = 0; i < artists.length; i++) {
    const a = artists[i]
    const [row] = await db
      .insert(artistsTable)
      .values({
        slug: a.slug,
        name: a.name,
        role: a.role,
        tagline: a.tagline,
        bio: a.bio.join('\n\n'),
        image: a.image,
        links: Object.fromEntries(
          Object.entries(a.links).filter(([, v]) => typeof v === 'string'),
        ) as Record<string, string>,
        pressKitNote: a.pressKitNote,
        sortOrder: i,
        published: true,
      })
      .onConflictDoUpdate({
        target: artistsTable.slug,
        set: { name: a.name, role: a.role, tagline: a.tagline },
      })
      .returning({ id: artistsTable.id })
    artistIds.set(a.slug, row.id)
  }

  console.log('[v0] Seeding releases and tracks...')
  for (let i = 0; i < releases.length; i++) {
    const r = releases[i]
    const [row] = await db
      .insert(releasesTable)
      .values({
        slug: r.slug,
        title: r.title,
        artistId: artistIds.get(r.artistSlug) ?? null,
        type: r.type,
        releaseDate: r.releaseDate,
        cover: r.coverImage,
        description: r.description,
        story: r.story ?? '',
        mood: r.mood,
        tags: r.tags,
        credits: r.credits,
        featured: r.featured ?? false,
        published: true,
        sortOrder: i,
        streamingLinks: Object.fromEntries(
          Object.entries(r.streaming).filter(([, v]) => typeof v === 'string'),
        ) as Record<string, string>,
      })
      .onConflictDoUpdate({
        target: releasesTable.slug,
        set: { title: r.title, description: r.description },
      })
      .returning({ id: releasesTable.id })

    for (let t = 0; t < r.tracks.length; t++) {
      const track = r.tracks[t]
      await db
        .insert(tracksTable)
        .values({
          releaseId: row.id,
          slug: track.slug,
          title: track.title,
          trackNumber: t + 1,
          duration: track.duration ?? '',
          storyNote: track.storyNote,
          lyricsStanzas: track.lyrics,
          spokenIntro: track.spokenIntro ?? '',
          spokenOutro: track.spokenOutro ?? '',
          creditsList: track.credits,
          published: true,
        })
        .onConflictDoNothing()
    }
  }

  console.log('[v0] Seeding site settings...')
  await db
    .insert(settingsTable)
    .values({ key: 'site', value: siteSettings as unknown as Record<string, unknown> })
    .onConflictDoUpdate({
      target: settingsTable.key,
      set: { value: siteSettings as unknown as Record<string, unknown> },
    })

  console.log('[v0] Seeding media assets...')
  const media = [
    { path: '/images/brand/brand-seal.webp', name: 'Brand seal', usage: 'Logo, header, footer' },
    { path: '/images/brand/ram-emblem-large.webp', name: 'Ram emblem (large)', usage: 'Feature artwork' },
    { path: '/images/brand/hero-wide.webp', name: 'Hero artwork (wide)', usage: 'Homepage & page heroes' },
    { path: '/images/brand/hero-square.webp', name: 'Hero artwork (square)', usage: 'OG image, social' },
    { path: '/images/covers/ex-igne-et-dolore.png', name: 'Ex Igne et Dolore cover', usage: 'Release cover' },
    { path: '/images/covers/black-ink-salvation.png', name: 'Black Ink Salvation cover', usage: 'Release cover' },
    { path: '/images/covers/still-standing-in-the-fire.png', name: 'Still Standing in the Fire cover', usage: 'Release cover' },
    { path: '/images/covers/afterglow-sax.png', name: 'Afterglow Sax cover', usage: 'Release cover' },
    { path: '/images/covers/velvet-rain-sax.png', name: 'Velvet Rain Sax cover', usage: 'Release cover' },
    { path: '/images/covers/morning-glow-sax.png', name: 'Morning Glow Sax cover', usage: 'Release cover' },
    { path: '/images/artists/ashborn-aries.png', name: 'Ashborn Aries visual', usage: 'Artist image' },
    { path: '/images/artists/golden-lama-sax.png', name: 'Golden Lama Sax visual', usage: 'Artist image' },
    { path: '/images/artists/ashborn-instrumentals.png', name: 'Ashborn Instrumentals visual', usage: 'Artist image' },
    { path: '/images/visual/black-road.png', name: 'Black road', usage: 'Visual World' },
    { path: '/images/visual/fire-ash.png', name: 'Fire & ash', usage: 'Visual World' },
    { path: '/images/visual/tattoo-marks.png', name: 'Tattoo marks', usage: 'Visual World' },
    { path: '/images/visual/bronze-ember.png', name: 'Bronze ember', usage: 'Visual World' },
  ]
  for (const m of media) {
    await db.insert(mediaAssets).values(m).onConflictDoNothing()
  }

  console.log('[v0] Seed complete.')
  await pool.end()
}

seed().catch((e) => {
  console.error('[v0] Seed failed:', e)
  process.exit(1)
})

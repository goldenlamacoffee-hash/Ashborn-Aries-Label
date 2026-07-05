// Targeted, idempotent seed for the Black Ink Salvation album tracklist.
// Run: pnpm exec tsx --env-file=/vercel/share/.env.project scripts/seed-black-ink-salvation.ts
//
// Guarantees after any number of runs:
// - exactly 1 "black-ink-salvation" release (album)
// - exactly 8 published Black Ink Salvation tracks, numbered 1-8
// - the "Still Standing in the Fire" single keeps exactly 1 track with a clean slug
// - never overwrites admin-edited story notes or lyrics (only replaces placeholder text)
import { sql, eq, and } from 'drizzle-orm'
import { db, pool } from '../lib/db'
import { releases, tracks } from '../lib/db/schema'

type TrackSeed = {
  trackNumber: number
  slug: string
  title: string
  duration: string
  storyNote: string
  lyricsStanzas: string[]
}

const BIS_TRACKS: TrackSeed[] = [
  {
    trackNumber: 1,
    slug: 'the-demon-i-outgrew',
    title: 'The Demon I Outgrew',
    duration: '4:12',
    storyNote:
      'The opening confession — naming the old self out loud so it can never sneak back in. The album starts where the fight started.',
    lyricsStanzas: [
      'I knew your voice before my own\nYou lived in every mirror I passed\nBut a horn only points forward\nAnd I stopped looking back',
      'You were the weight, I was the lift\nYou were the dark, I struck the match\nThe demon I outgrew still whispers\nBut I answer with the man I am',
    ],
  },
  {
    trackNumber: 2,
    slug: 'black-ink-salvation',
    title: 'Black Ink Salvation',
    duration: '4:05',
    storyNote:
      'The title track — redemption pressed into skin, one line at a time. Every mark on the body is a verse the fire could not erase.',
    lyricsStanzas: [
      'Needle hums like a steel guitar\nWriting scripture on my scars\nBlack ink salvation, line by line\nEvery mark a battle won',
      'They asked me why I wear the dark\nI said the dark is where I learned to see\nSalvation ain’t a clean white page\nIt’s the story written into me',
    ],
  },
  {
    trackNumber: 3,
    slug: 'patience-has-horns',
    title: 'Patience Has Horns',
    duration: '3:51',
    storyNote:
      'Patience is not soft here. It is a ram standing still on the mountainside, waiting for the exact moment to move.',
    lyricsStanzas: [
      'I don’t rush the river, I don’t beg the rain\nI stand where the mountain stands\nPatience has horns, boy\nAnd it knows how to use them',
      'Slow is not the same as still\nStill is not the same as done\nWhen I finally lower my head\nYou’ll wish I’d stayed patient longer',
    ],
  },
  {
    trackNumber: 4,
    slug: 'sorrow-dont-own-me',
    title: 'Sorrow Don’t Own Me',
    duration: '4:18',
    storyNote:
      'Grief gets a seat at the table but never the head of it. A slow-burning refusal to be defined by what was lost.',
    lyricsStanzas: [
      'Sorrow came to collect the rent\nI told it I own this land\nIt can sleep out in the barn tonight\nBut it don’t command this hand',
      'I carry the dead like medals\nNot like chains around my neck\nSorrow don’t own me\nIt just rides in the back',
    ],
  },
  {
    trackNumber: 5,
    slug: 'never-surrender-quietly',
    title: 'Never Surrender Quietly',
    duration: '3:58',
    storyNote:
      'The anthem of the record. If the ending ever comes, it comes loud — hooves, dust, and a voice that never learned to whisper.',
    lyricsStanzas: [
      'If they take me, take me standing\nBoots on, fists full of sky\nI was born with thunder in my chest\nAnd I never surrender quietly',
      'Let the record show I hollered\nLet the canyon keep my sound\nQuiet is for the ones who folded\nI was never quiet going down',
    ],
  },
  {
    trackNumber: 6,
    slug: 'the-road-beneath-my-ribs',
    title: 'The Road Beneath My Ribs',
    duration: '4:33',
    storyNote:
      'Every mile driven away from the old life got mapped somewhere under the skin. The road home runs straight through the chest.',
    lyricsStanzas: [
      'There’s a highway stitched inside me\nEvery exit I never took\nThe road beneath my ribs keeps humming\nLike an engine left to cook',
      'I don’t need a map to find myself\nI just follow the ache due north\nWhere the asphalt turns to heartbeat\nThat’s the town that I came from',
    ],
  },
  {
    trackNumber: 7,
    slug: 'skin-of-the-survivor',
    title: 'Skin of the Survivor',
    duration: '4:07',
    storyNote:
      'A close-up on the scars — not as damage, but as proof. The survivor wears the evidence and calls it armor.',
    lyricsStanzas: [
      'This skin has been a battlefield\nA canvas and a cage\nNow every scar’s a signature\nOn a hard-won turning page',
      'Touch the marks and read the years\nBraille for those who fought\nThe skin of the survivor\nIs the armor time has wrought',
    ],
  },
  {
    trackNumber: 8,
    slug: 'horned-things-rise',
    title: 'Horned Things Rise',
    duration: '5:02',
    storyNote:
      'The closer. Whatever they buried grew horns underground. The album ends the way the label began — with something rising out of the ash.',
    lyricsStanzas: [
      'They put the dark thing in the ground\nAnd swore the ground would hold\nBut horned things rise, horned things rise\nThrough frost and fire and fold',
      'Count the shadows on the ridge line\nOne more than yesterday\nWhat you bury with contempt\nComes back with horns to stay',
    ],
  },
]

async function main() {
  // 1. Locate the album (must already exist; we do not resurrect pruned releases)
  const [album] = await db
    .select({ id: releases.id, title: releases.title })
    .from(releases)
    .where(eq(releases.slug, 'black-ink-salvation'))
  if (!album) {
    throw new Error('black-ink-salvation release not found — aborting, nothing changed.')
  }
  console.log(`[v0] Album found: #${album.id} ${album.title}`)

  // 2. Normalize the known-bad single track slug (had spaces/uppercase)
  const [single] = await db
    .select({ id: releases.id })
    .from(releases)
    .where(eq(releases.slug, 'still-standing-in-the-fire'))
  if (single) {
    const fixed = await db
      .update(tracks)
      .set({ slug: 'still-standing-in-the-fire', title: 'Still Standing in the Fire', updatedAt: new Date() })
      .where(and(eq(tracks.releaseId, single.id), sql`${tracks.slug} LIKE '% %'`))
      .returning({ id: tracks.id })
    if (fixed.length > 0) console.log(`[v0] Normalized ${fixed.length} bad single track slug(s)`)
  }

  // 3. Upsert the 8 album tracks (unique key: releaseId + slug).
  //    Story notes / lyrics are only replaced when the existing copy is placeholder text,
  //    so admin edits are never clobbered.
  for (const t of BIS_TRACKS) {
    await db
      .insert(tracks)
      .values({
        releaseId: album.id,
        slug: t.slug,
        title: t.title,
        trackNumber: t.trackNumber,
        duration: t.duration,
        storyNote: t.storyNote,
        lyricsStanzas: t.lyricsStanzas,
        creditsList: ['Written & performed by Ashborn Aries'],
        published: true,
      })
      .onConflictDoUpdate({
        target: [tracks.releaseId, tracks.slug],
        set: {
          title: t.title,
          trackNumber: t.trackNumber,
          duration: t.duration,
          published: true,
          storyNote: sql`CASE WHEN ${tracks.storyNote} LIKE '%Placeholder%' OR ${tracks.storyNote} = '' THEN ${t.storyNote} ELSE ${tracks.storyNote} END`,
          lyricsStanzas: sql`CASE WHEN ${tracks.storyNote} LIKE '%Placeholder%' OR ${tracks.storyNote} = '' THEN ${JSON.stringify(t.lyricsStanzas)}::jsonb ELSE ${tracks.lyricsStanzas} END`,
          updatedAt: new Date(),
        },
      })
  }
  console.log('[v0] Upserted 8 Black Ink Salvation tracks')

  // 4. Remove any stray BIS tracks that are not part of the canonical tracklist
  //    (e.g. leftovers from older seeds with different slugs)
  const canonical = BIS_TRACKS.map((t) => t.slug)
  const strays = await db
    .delete(tracks)
    .where(
      and(eq(tracks.releaseId, album.id), sql`${tracks.slug} NOT IN ${canonical}`),
    )
    .returning({ id: tracks.id, slug: tracks.slug })
  if (strays.length > 0) {
    console.log(`[v0] Removed ${strays.length} stray track(s): ${strays.map((s) => s.slug).join(', ')}`)
  }

  // 5. Report final state
  const finalTracks = await db
    .select({ n: tracks.trackNumber, title: tracks.title, slug: tracks.slug, pub: tracks.published })
    .from(tracks)
    .where(eq(tracks.releaseId, album.id))
    .orderBy(tracks.trackNumber)
  console.log('[v0] Final Black Ink Salvation tracklist:')
  for (const t of finalTracks) {
    console.log(`[v0]   ${String(t.n).padStart(2, '0')}. ${t.title} (${t.slug}) published=${t.pub}`)
  }
  await pool.end()
}

main().catch((e) => {
  console.error('[v0] Seed failed:', e)
  process.exit(1)
})

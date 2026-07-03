// -----------------------------------------------------------------------------
// Ashborn Aries Label — data layer
// Seeded data first. All content here is CMS-editable placeholder content and
// is structured so it can be swapped for a Postgres/Neon-backed store via
// DATABASE_URL later without changing the page components.
// -----------------------------------------------------------------------------

export type ReleaseType = 'album' | 'single'
export type ReleaseTag =
  | 'dark country'
  | 'sax'
  | 'instrumental'
  | 'neoclassical'

export interface StreamingLinks {
  spotify?: string
  appleMusic?: string
  youtube?: string
}

export interface Track {
  slug: string
  title: string
  duration?: string
  storyNote: string
  spokenIntro?: string
  spokenOutro?: string
  lyrics: string[] // stanzas; each entry is one stanza (lines separated by \n)
  credits: string[]
}

export interface Release {
  slug: string
  title: string
  type: ReleaseType
  artistSlug: string
  artistName: string
  releaseDate: string
  mood: string
  description: string
  story?: string
  coverImage: string
  tags: ReleaseTag[]
  featured?: boolean
  streaming: StreamingLinks
  tracks: Track[]
  credits: string[]
}

export interface Artist {
  slug: string
  name: string
  role: string
  tagline: string
  bio: string[]
  image: string
  links: StreamingLinks & { website?: string }
  pressKitNote: string
  placeholder: boolean
}

export interface SiteSettings {
  siteName: string
  domain: string
  tagline: string
  footerLine: string
  contactEmail: string
  heroHeadline: string
  heroSubtitle: string
  heroCopy: string
  social: { label: string; href: string }[]
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const siteSettings: SiteSettings = {
  siteName: 'Ashborn Aries Label',
  domain: 'ashbornaries.music',
  tagline: 'From fire and pain.',
  footerLine: 'Real music. Dark roots. No apologies.',
  contactEmail: 'contact@ashbornaries.music',
  heroHeadline: 'ASHBORN ARIES LABEL',
  heroSubtitle: 'From fire and pain.',
  heroCopy:
    'Dark country. Southern gothic. Outlaw soul. Music forged in ash, discipline, and truth.',
  social: [
    { label: 'Spotify', href: '#' },
    { label: 'Apple Music', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
}

// ---------------------------------------------------------------------------
// Helpers for placeholder lyrics (clearly editable, never final)
// ---------------------------------------------------------------------------

const placeholderCredits = [
  'Written by: [Editable — add songwriter credits]',
  'Produced by: Ashborn Aries Label',
  'Published by: Ashborn Aries Label — ashbornaries.music',
]

function placeholderLyrics(title: string, theme: string): string[] {
  return [
    `[Verse 1 — placeholder]\nThese lines stand in for "${title}".\nReplace them in the admin CMS\nwith the final written lyrics.`,
    `[Chorus — placeholder]\nA song about ${theme} —\nthe real words live in the vault\nuntil the label sets them here.`,
    `[Verse 2 — placeholder]\nStructure, stanzas, and story notes\nare fully editable per track.\nNothing on this page is final copy.`,
  ]
}

// ---------------------------------------------------------------------------
// Artists / Projects (editable placeholder profiles — not real people)
// ---------------------------------------------------------------------------

export const artists: Artist[] = [
  {
    slug: 'ashborn-aries',
    name: 'Ashborn Aries',
    role: 'Flagship project — dark country / Southern gothic',
    tagline: 'A voice forged in ash, discipline, and truth.',
    bio: [
      'Ashborn Aries is the flagship project of the label — dark country and Southern gothic music built around fire, pain, scars, and rebirth. Every record is a chapter: a man walking through hell and coming back with fire in his chest.',
      'This is an editable project profile. Biography, imagery, and links are managed through the label CMS and will grow as the catalog grows.',
    ],
    image: '/images/artists/ashborn-aries.png',
    links: { spotify: '#', appleMusic: '#', youtube: '#' },
    pressKitNote:
      'Press kit — logos, approved imagery, and one-sheet available on request via the label. Contact contact@ashbornaries.music.',
    placeholder: true,
  },
  {
    slug: 'golden-lama-sax-sessions',
    name: 'Golden Lama Sax Sessions',
    role: 'Sax lounge / smoky instrumental sessions',
    tagline: 'Smoke, brass, and late-night afterglow.',
    bio: [
      'Golden Lama Sax Sessions is the label’s smoky saxophone lounge series — warm brass over dark rooms, rain-streaked windows, and slow-burning late-night atmosphere.',
      'This is an editable project profile managed through the label CMS.',
    ],
    image: '/images/artists/golden-lama-sax.png',
    links: { spotify: '#', appleMusic: '#', youtube: '#' },
    pressKitNote:
      'Press kit available on request via the label. Contact contact@ashbornaries.music.',
    placeholder: true,
  },
  {
    slug: 'ashborn-instrumentals',
    name: 'Ashborn Instrumentals',
    role: 'Cinematic western / emotional instrumental',
    tagline: 'Scores for black roads and burning skies.',
    bio: [
      'Ashborn Instrumentals collects the label’s cinematic western and emotional instrumental work — music built for atmosphere, licensing, and story.',
      'This is an editable project profile managed through the label CMS.',
    ],
    image: '/images/artists/ashborn-instrumentals.png',
    links: { spotify: '#', appleMusic: '#', youtube: '#' },
    pressKitNote:
      'Press kit available on request via the label. Contact contact@ashbornaries.music.',
    placeholder: true,
  },
]

// ---------------------------------------------------------------------------
// Releases
// ---------------------------------------------------------------------------

export const releases: Release[] = [
  {
    slug: 'ex-igne-et-dolore',
    title: 'Ex Igne et Dolore',
    type: 'album',
    artistSlug: 'ashborn-aries',
    artistName: 'Ashborn Aries',
    releaseDate: '2025',
    mood: 'Dark country · concept album',
    description:
      'A dark country concept album about fire, pain, discipline, love, scars, and rebirth. A man walking through hell and coming back with fire in his chest.',
    story:
      'Ex Igne et Dolore — “from fire and pain” — is the record the label was founded on. Nine chapters of one story: the burn, the wound, the long black road, and the slow return. It is not written to comfort. It is written to stand.',
    coverImage: '/images/covers/ex-igne-et-dolore.png',
    tags: ['dark country'],
    featured: true,
    streaming: { spotify: '#', appleMusic: '#', youtube: '#' },
    credits: placeholderCredits,
    tracks: [
      {
        slug: 'where-the-fire-met-the-wound',
        title: 'Where the Fire Met the Wound',
        duration: '4:12',
        storyNote:
          'The opening chapter — the moment the burn and the scar become the same thing. Placeholder story note, editable in the CMS.',
        spokenIntro:
          '[Spoken intro — placeholder] A low voice over ember crackle. Final spoken text is set in the CMS.',
        lyrics: placeholderLyrics('Where the Fire Met the Wound', 'fire meeting old wounds'),
        credits: placeholderCredits,
      },
      {
        slug: 'still-standing-in-the-fire',
        title: 'Still Standing in the Fire',
        duration: '3:58',
        storyNote:
          'The anthem of the record — refusing to fall while everything burns. Placeholder story note, editable in the CMS.',
        lyrics: placeholderLyrics('Still Standing in the Fire', 'standing while everything burns'),
        credits: placeholderCredits,
      },
      {
        slug: 'ash-in-my-blood',
        title: 'Ash in My Blood',
        duration: '4:31',
        storyNote: 'Heritage and inheritance — what the fire leaves behind. Placeholder story note.',
        lyrics: placeholderLyrics('Ash in My Blood', 'inheritance and ash'),
        credits: placeholderCredits,
      },
      {
        slug: 'black-road-home',
        title: 'Black Road Home',
        duration: '5:02',
        storyNote: 'The long drive back through everything you left burning. Placeholder story note.',
        lyrics: placeholderLyrics('Black Road Home', 'the long road home'),
        credits: placeholderCredits,
      },
      {
        slug: 'discipline',
        title: 'Discipline',
        duration: '3:44',
        storyNote: 'The quiet, brutal work of rebuilding. Placeholder story note.',
        lyrics: placeholderLyrics('Discipline', 'discipline and rebuilding'),
        credits: placeholderCredits,
      },
      {
        slug: 'her-name-in-smoke',
        title: 'Her Name in Smoke',
        duration: '4:20',
        storyNote: 'Love written in something that doesn’t last. Placeholder story note.',
        lyrics: placeholderLyrics('Her Name in Smoke', 'love and smoke'),
        credits: placeholderCredits,
      },
      {
        slug: 'scars-are-proof',
        title: 'Scars Are Proof',
        duration: '3:36',
        storyNote: 'Marks as evidence of survival, not weakness. Placeholder story note.',
        lyrics: placeholderLyrics('Scars Are Proof', 'scars as proof of survival'),
        credits: placeholderCredits,
      },
      {
        slug: 'rebirth',
        title: 'Rebirth',
        duration: '5:15',
        storyNote: 'The closing chapter — coming back with fire in the chest. Placeholder story note.',
        spokenOutro:
          '[Spoken outro — placeholder] Final words over fading embers. Editable in the CMS.',
        lyrics: placeholderLyrics('Rebirth', 'rebirth from fire'),
        credits: placeholderCredits,
      },
    ],
  },
  {
    slug: 'black-ink-salvation',
    title: 'Black Ink Salvation',
    type: 'album',
    artistSlug: 'ashborn-aries',
    artistName: 'Ashborn Aries',
    releaseDate: '2025',
    mood: 'Dark country · tattoos & redemption',
    description:
      'Songs about tattoos, marks, and the stories carved into skin — salvation written in black ink.',
    story:
      'Black Ink Salvation treats the body as a record: every mark a verse, every scar a chorus. A darker, closer companion to Ex Igne et Dolore.',
    coverImage: '/images/covers/black-ink-salvation.png',
    tags: ['dark country'],
    streaming: { spotify: '#', appleMusic: '#', youtube: '#' },
    credits: placeholderCredits,
    tracks: [
      {
        slug: 'black-ink-salvation',
        title: 'Black Ink Salvation',
        duration: '4:05',
        storyNote:
          'The title track — redemption pressed into skin, one line at a time. Placeholder story note, editable in the CMS.',
        lyrics: placeholderLyrics('Black Ink Salvation', 'salvation in black ink'),
        credits: placeholderCredits,
      },
      {
        slug: 'needle-and-nerve',
        title: 'Needle and Nerve',
        duration: '3:49',
        storyNote: 'Pain chosen on purpose. Placeholder story note.',
        lyrics: placeholderLyrics('Needle and Nerve', 'chosen pain'),
        credits: placeholderCredits,
      },
      {
        slug: 'marked-man',
        title: 'Marked Man',
        duration: '4:22',
        storyNote: 'Wearing the past where everyone can see it. Placeholder story note.',
        lyrics: placeholderLyrics('Marked Man', 'wearing the past openly'),
        credits: placeholderCredits,
      },
      {
        slug: 'thorns-and-horns',
        title: 'Thorns and Horns',
        duration: '3:57',
        storyNote: 'The ram and the crown of thorns — strength and suffering. Placeholder story note.',
        lyrics: placeholderLyrics('Thorns and Horns', 'strength and suffering'),
        credits: placeholderCredits,
      },
      {
        slug: 'ink-dont-wash',
        title: 'Ink Don’t Wash',
        duration: '4:10',
        storyNote: 'Some choices are permanent. That’s the point. Placeholder story note.',
        lyrics: placeholderLyrics('Ink Don’t Wash', 'permanence'),
        credits: placeholderCredits,
      },
      {
        slug: 'last-line',
        title: 'Last Line',
        duration: '5:01',
        storyNote: 'The closing mark — the one you save for the end. Placeholder story note.',
        lyrics: placeholderLyrics('Last Line', 'the final mark'),
        credits: placeholderCredits,
      },
    ],
  },
  {
    slug: 'still-standing-in-the-fire',
    title: 'Still Standing in the Fire',
    type: 'single',
    artistSlug: 'ashborn-aries',
    artistName: 'Ashborn Aries',
    releaseDate: '2025',
    mood: 'Dark country · anthem',
    description:
      'The standalone single cut of the album anthem — refusing to fall while everything burns.',
    coverImage: '/images/covers/still-standing-in-the-fire.png',
    tags: ['dark country'],
    streaming: { spotify: '#', appleMusic: '#', youtube: '#' },
    credits: placeholderCredits,
    tracks: [
      {
        slug: 'still-standing-in-the-fire-single',
        title: 'Still Standing in the Fire (Single Version)',
        duration: '3:58',
        storyNote: 'Single edit of the album anthem. Placeholder story note, editable in the CMS.',
        lyrics: placeholderLyrics('Still Standing in the Fire', 'standing while everything burns'),
        credits: placeholderCredits,
      },
    ],
  },
  {
    slug: 'afterglow-sax',
    title: 'Afterglow Sax',
    type: 'single',
    artistSlug: 'golden-lama-sax-sessions',
    artistName: 'Golden Lama Sax Sessions',
    releaseDate: '2025',
    mood: 'Sax lounge · late night',
    description:
      'Warm brass over a dark room — the slow-burning afterglow of a long night.',
    coverImage: '/images/covers/afterglow-sax.png',
    tags: ['sax', 'instrumental'],
    streaming: { spotify: '#', appleMusic: '#', youtube: '#' },
    credits: placeholderCredits,
    tracks: [
      {
        slug: 'afterglow',
        title: 'Afterglow',
        duration: '5:24',
        storyNote: 'Instrumental — no lyrics. Story note editable in the CMS.',
        lyrics: ['[Instrumental — no lyrics. This note is editable placeholder content.]'],
        credits: placeholderCredits,
      },
    ],
  },
  {
    slug: 'velvet-rain-sax',
    title: 'Velvet Rain Sax',
    type: 'single',
    artistSlug: 'golden-lama-sax-sessions',
    artistName: 'Golden Lama Sax Sessions',
    releaseDate: '2025',
    mood: 'Sax lounge · rain & neon-less noir',
    description:
      'Saxophone against a rain-streaked window — velvet, smoke, and slow bronze light.',
    coverImage: '/images/covers/velvet-rain-sax.png',
    tags: ['sax', 'instrumental'],
    streaming: { spotify: '#', appleMusic: '#', youtube: '#' },
    credits: placeholderCredits,
    tracks: [
      {
        slug: 'velvet-rain',
        title: 'Velvet Rain',
        duration: '4:58',
        storyNote: 'Instrumental — no lyrics. Story note editable in the CMS.',
        lyrics: ['[Instrumental — no lyrics. This note is editable placeholder content.]'],
        credits: placeholderCredits,
      },
    ],
  },
  {
    slug: 'morning-glow-sax',
    title: 'Morning Glow Sax',
    type: 'single',
    artistSlug: 'golden-lama-sax-sessions',
    artistName: 'Golden Lama Sax Sessions',
    releaseDate: '2025',
    mood: 'Sax lounge · first light',
    description:
      'The first amber light after the longest night — quiet, unhurried, and warm.',
    coverImage: '/images/covers/morning-glow-sax.png',
    tags: ['sax', 'instrumental'],
    streaming: { spotify: '#', appleMusic: '#', youtube: '#' },
    credits: placeholderCredits,
    tracks: [
      {
        slug: 'morning-glow',
        title: 'Morning Glow',
        duration: '5:40',
        storyNote: 'Instrumental — no lyrics. Story note editable in the CMS.',
        lyrics: ['[Instrumental — no lyrics. This note is editable placeholder content.]'],
        credits: placeholderCredits,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

export function getReleases(): Release[] {
  return releases
}

export function getReleaseBySlug(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug)
}

export function getFeaturedRelease(): Release {
  return releases.find((r) => r.featured) ?? releases[0]
}

export function getReleasesByArtist(artistSlug: string): Release[] {
  return releases.filter((r) => r.artistSlug === artistSlug)
}

export function getArtists(): Artist[] {
  return artists
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug)
}

/** Albums that have lyric/story archives (multi-track releases). */
export function getLyricAlbums(): Release[] {
  return releases.filter((r) => r.type === 'album')
}

export function getTrack(
  albumSlug: string,
  trackSlug: string,
): { release: Release; track: Track } | undefined {
  const release = getReleaseBySlug(albumSlug)
  if (!release) return undefined
  const track = release.tracks.find((t) => t.slug === trackSlug)
  if (!track) return undefined
  return { release, track }
}

/** All filterable tags for the releases catalog. */
export const releaseFilters = [
  'all',
  'album',
  'single',
  'instrumental',
  'dark country',
  'sax',
  'neoclassical',
] as const

export type ReleaseFilter = (typeof releaseFilters)[number]

export function filterReleases(filter: ReleaseFilter): Release[] {
  if (filter === 'all') return releases
  if (filter === 'album' || filter === 'single') {
    return releases.filter((r) => r.type === filter)
  }
  return releases.filter((r) => r.tags.includes(filter as ReleaseTag))
}

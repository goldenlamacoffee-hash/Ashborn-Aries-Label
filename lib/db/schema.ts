import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

/* ------------------------------------------------------------------ */
/* Better Auth tables — column names must stay camelCase               */
/* ------------------------------------------------------------------ */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('editor'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

/* ------------------------------------------------------------------ */
/* CMS tables                                                          */
/* ------------------------------------------------------------------ */

export type StreamingLinks = Record<string, string>

export const artists = pgTable('artists', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default(''),
  tagline: text('tagline').notNull().default(''),
  bio: text('bio').notNull().default(''),
  image: text('image').notNull().default(''),
  links: jsonb('links').$type<StreamingLinks>().notNull().default({}),
  pressKitNote: text('press_kit_note').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const releases = pgTable('releases', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  artistId: integer('artist_id'),
  type: text('type').notNull().default('album'),
  releaseDate: text('release_date').notNull().default(''),
  cover: text('cover').notNull().default(''),
  description: text('description').notNull().default(''),
  story: text('story').notNull().default(''),
  mood: text('mood').notNull().default(''),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  credits: jsonb('credits').$type<string[]>().notNull().default([]),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  streamingLinks: jsonb('streaming_links')
    .$type<StreamingLinks>()
    .notNull()
    .default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const tracks = pgTable(
  'tracks',
  {
    id: serial('id').primaryKey(),
    releaseId: integer('release_id').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    trackNumber: integer('track_number').notNull().default(1),
    duration: text('duration').notNull().default(''),
    storyNote: text('story_note').notNull().default(''),
    lyricsStanzas: jsonb('lyrics_stanzas').$type<string[]>().notNull().default([]),
    spokenIntro: text('spoken_intro').notNull().default(''),
    spokenOutro: text('spoken_outro').notNull().default(''),
    creditsList: jsonb('credits_list').$type<string[]>().notNull().default([]),
    published: boolean('published').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.releaseId, t.slug)],
)

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').$type<Record<string, unknown>>().notNull().default({}),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull().default(''),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const mediaAssets = pgTable('media_assets', {
  id: serial('id').primaryKey(),
  path: text('path').notNull().unique(),
  name: text('name').notNull(),
  usage: text('usage').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

/* Inferred types */
export type Artist = typeof artists.$inferSelect
export type Release = typeof releases.$inferSelect
export type Track = typeof tracks.$inferSelect
export type ContactMessage = typeof contactMessages.$inferSelect
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type MediaAsset = typeof mediaAssets.$inferSelect

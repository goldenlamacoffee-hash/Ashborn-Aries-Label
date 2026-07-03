import Image from 'next/image'
import { HeroSection } from '@/components/hero-section'
import { SectionDivider } from '@/components/section-divider'
import { ReleaseCard } from '@/components/release-card'
import { EmberButton } from '@/components/ember-button'
import { StoryCard } from '@/components/story-card'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { getReleases, getFeaturedRelease } from '@/lib/data'

const storyPreviews = [
  {
    title: 'Where the Fire Met the Wound',
    note: 'The opening chapter of Ex Igne et Dolore — the moment the burn and the scar become the same thing.',
    href: '/lyrics/ex-igne-et-dolore/where-the-fire-met-the-wound',
  },
  {
    title: 'Still Standing in the Fire',
    note: 'The anthem of the record — refusing to fall while everything burns.',
    href: '/lyrics/ex-igne-et-dolore/still-standing-in-the-fire',
  },
  {
    title: 'Black Ink Salvation',
    note: 'Redemption pressed into skin, one line at a time.',
    href: '/lyrics/black-ink-salvation/black-ink-salvation',
  },
]

export default function HomePage() {
  const releases = getReleases()
  const featured = getFeaturedRelease()

  return (
    <>
      <HeroSection />

      {/* Latest Releases */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            The Catalog
          </p>
          <h2 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl">
            Latest Releases
          </h2>
          <SectionDivider className="w-full" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((release) => (
            <ReleaseCard key={release.slug} release={release} />
          ))}
        </div>
      </section>

      {/* Featured Release */}
      <section className="border-y border-bronze/20 bg-card/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 md:flex-row md:gap-16 md:px-6 md:py-28">
          <div className="ember-glow relative aspect-square w-full max-w-sm shrink-0 overflow-hidden rounded-sm border border-bronze/40">
            <Image
              src={featured.coverImage || '/placeholder.svg'}
              alt={`${featured.title} cover art`}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
              Featured Release
            </p>
            <h2 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl text-balance">
              {featured.title}
            </h2>
            <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
              {featured.artistName} · {featured.mood}
            </p>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-foreground/80 md:text-base text-pretty">
              A dark country concept album about fire, pain, discipline, love, scars, and rebirth. A
              man walking through hell and coming back with fire in his chest.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <EmberButton href={`/releases/${featured.slug}`}>Read the Story</EmberButton>
              <EmberButton href={`/releases/${featured.slug}`} variant="secondary">
                Listen Now
              </EmberButton>
            </div>
          </div>
        </div>
      </section>

      {/* Label Story */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'url(/images/visual/fire-ash.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center md:px-6 md:py-28">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            The Label
          </p>
          <h2 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl">
            Born from Ash
          </h2>
          <SectionDivider className="w-full" />
          <p className="font-sans text-sm leading-relaxed text-foreground/80 md:text-base text-pretty">
            Ashborn Aries Label is an independent music label built for songs with scars. We release
            dark country, Southern gothic, cinematic western, sax lounge, and emotional instrumental
            music shaped by pain, discipline, and story.
          </p>
          <EmberButton href="/label" variant="secondary" className="mt-2">
            About the Label
          </EmberButton>
        </div>
      </section>

      {/* Lyrics & Stories Preview */}
      <section className="border-t border-bronze/20 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
              The Vault
            </p>
            <h2 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl">
              Lyrics &amp; Stories
            </h2>
            <SectionDivider className="w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {storyPreviews.map((story) => (
              <StoryCard key={story.title} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-bronze/20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center md:px-6 md:py-28">
          <h2 className="foil-text font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl">
            Join the Family
          </h2>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground md:text-base text-pretty">
            Get the latest releases, lyrics, stories, and limited drops from Ashborn Aries Label.
          </p>
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}

import Image from 'next/image'
import { EmberButton } from '@/components/ember-button'
import { EmberParticles } from '@/components/ember-particles'
import { getSiteSettings } from '@/lib/cms'

export async function HeroSection() {
  const siteSettings = await getSiteSettings()
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Official brand artwork */}
      <div className="absolute inset-0">
        <Image
          src={siteSettings.heroImage || '/images/brand/hero-wide.webp'}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-top opacity-90 sm:block"
        />
        <Image
          src={siteSettings.ogImage || '/images/brand/hero-square.webp'}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-90 sm:hidden"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background"
          aria-hidden="true"
        />
      </div>

      <EmberParticles />

      {/* Hero content per brand manual p.04 — bold statement with clear CTAs */}
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-4xl flex-col items-center justify-end gap-5 px-4 pb-20 pt-40 text-center md:px-6 md:pb-24">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-gold/90 md:text-sm">
          Ashborn Aries Label
        </p>
        <h1 className="foil-text font-serif text-4xl font-bold uppercase leading-tight tracking-wide text-balance md:text-6xl">
          {siteSettings.heroHeadline}
        </h1>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-foreground/85 md:text-base">
          {siteSettings.heroSubtitle}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <EmberButton href="/releases">Listen Now</EmberButton>
          <EmberButton href="/artists" variant="secondary">
            Explore Artists
          </EmberButton>
        </div>
      </div>
    </section>
  )
}

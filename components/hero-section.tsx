import Image from 'next/image'
import { EmberButton } from '@/components/ember-button'
import { EmberParticles } from '@/components/ember-particles'
import { getSiteSettings } from '@/lib/cms'

export async function HeroSection() {
  const siteSettings = await getSiteSettings()

  const desktopImage = siteSettings.heroImage || '/images/brand/hero-clean-wide.png'
  const mobileImage =
    siteSettings.heroMobileImage || siteSettings.heroImage || '/images/brand/hero-clean-mobile.png'

  // Overlay strength (0–100) controls how dark the scrim behind the headline is.
  const strength =
    typeof siteSettings.heroOverlayStrength === 'number' ? siteSettings.heroOverlayStrength : 70
  const overlayOpacity = Math.min(Math.max(strength, 0), 100) / 100

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Decorative background artwork — must never contain baked-in text */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Mobile: portrait crop */}
        <Image
          src={mobileImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%] opacity-80 sm:hidden"
        />
        {/* Desktop / tablet: wide crop */}
        <Image
          src={desktopImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center opacity-90 sm:block"
        />

        {/* Base vertical gradient — keeps top (header) and bottom (content) readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        {/* Radial darkness focused behind the headline block */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 90% 60% at 50% 78%, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,${overlayOpacity * 0.55}) 45%, rgba(0,0,0,0) 80%)`,
          }}
        />
        {/* Top vignette so the fixed header never fights the artwork */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/90 to-transparent" />
      </div>

      <EmberParticles />

      {/* Hero content — always above the background via z-index */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col items-center justify-end gap-5 px-4 pb-16 pt-28 text-center sm:justify-center sm:pb-24 sm:pt-32 md:min-h-[92svh] md:px-6">
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold/90 sm:text-xs md:text-sm md:tracking-[0.35em]">
          Ashborn Aries Label
        </p>
        <h1
          className="foil-text max-w-[92vw] font-serif font-bold uppercase text-balance"
          style={{
            fontSize: 'clamp(2.3rem, 12vw, 4.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            overflowWrap: 'normal',
          }}
        >
          {siteSettings.heroHeadline}
        </h1>
        <p className="max-w-[90vw] font-display text-xs uppercase tracking-[0.22em] text-foreground/85 sm:text-sm sm:tracking-[0.3em] md:text-base">
          {siteSettings.heroSubtitle}
        </p>
        <div className="mt-4 flex w-full max-w-[280px] flex-col gap-3 sm:mt-6 sm:max-w-none sm:flex-row sm:justify-center">
          <EmberButton href="/releases" className="w-full sm:w-auto">
            Listen Now
          </EmberButton>
          <EmberButton href="/artists" variant="secondary" className="w-full sm:w-auto">
            Explore Artists
          </EmberButton>
        </div>
      </div>
    </section>
  )
}

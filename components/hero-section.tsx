import Image from 'next/image'
import { EmberButton } from '@/components/ember-button'
import { EmberParticles } from '@/components/ember-particles'
import { siteSettings } from '@/lib/data'

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background">
      <Image
        src="/images/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background"
        aria-hidden="true"
      />
      <EmberParticles />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-32 text-center md:px-6">
        <Image
          src="/images/ram-emblem.png"
          alt="Ashborn Aries Label ram emblem"
          width={160}
          height={160}
          priority
          className="h-28 w-28 rounded-full border border-bronze/50 object-cover shadow-[0_0_60px_rgba(255,90,31,0.15)] md:h-40 md:w-40"
        />
        <h1 className="foil-text font-serif text-4xl font-bold uppercase leading-tight tracking-[0.12em] text-balance sm:text-5xl md:text-6xl">
          {siteSettings.heroHeadline}
        </h1>
        <p className="font-serif text-lg uppercase tracking-[0.3em] text-gold md:text-xl">
          {siteSettings.heroSubtitle}
        </p>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-foreground/80 md:text-base text-pretty">
          {siteSettings.heroCopy}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <EmberButton href="/releases">Listen Now</EmberButton>
          <EmberButton href="/releases" variant="secondary">
            Explore Releases
          </EmberButton>
          <EmberButton href="/lyrics" variant="secondary">
            Enter the Story
          </EmberButton>
        </div>
      </div>
    </section>
  )
}

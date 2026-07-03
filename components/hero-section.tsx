import Image from 'next/image'
import { EmberButton } from '@/components/ember-button'
import { EmberParticles } from '@/components/ember-particles'
import { siteSettings } from '@/lib/data'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Official brand artwork carries the visual identity — including the engraved wordmark. */}
      <div className="relative aspect-square w-full sm:aspect-[16/9]">
        <Image
          src="/images/brand/hero-wide.webp"
          alt="Ashborn Aries Label — engraved ram emblem over charred black, ESTD MMXXV"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-top sm:block"
        />
        <Image
          src="/images/brand/hero-square.webp"
          alt="Ashborn Aries Label — engraved ram emblem over charred black, ESTD MMXXV"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top sm:hidden"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
          aria-hidden="true"
        />
      </div>

      <EmberParticles />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 pb-24 pt-2 text-center md:px-6">
        <h1 className="sr-only">{siteSettings.heroHeadline}</h1>
        <p className="font-serif text-lg uppercase tracking-[0.3em] text-gold md:text-xl">
          {siteSettings.heroSubtitle}
        </p>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-foreground/80 md:text-base text-pretty">
          {siteSettings.heroCopy}
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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

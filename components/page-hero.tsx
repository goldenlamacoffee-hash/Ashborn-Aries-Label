import { SectionDivider } from '@/components/section-divider'
import { getSiteSettings } from '@/lib/cms'

/** Shared cinematic header for interior pages. Background is CMS-managed. */
export async function PageHero({
  eyebrow,
  title,
  copy,
  backgroundImage,
}: {
  eyebrow?: string
  title: string
  copy?: string
  backgroundImage?: string
}) {
  const settings = await getSiteSettings()
  const bg = backgroundImage || settings.pageHeroBackground || '/images/brand/hero-wide.webp'
  return (
    <section className="relative overflow-hidden border-b border-bronze/20 bg-background pb-14 pt-32 md:pb-20 md:pt-44">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 22%',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center md:px-6">
        {eyebrow && (
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            {eyebrow}
          </p>
        )}
        <h1 className="foil-text font-serif text-4xl font-bold uppercase tracking-wide text-balance md:text-5xl">
          {title}
        </h1>
        {copy && (
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground md:text-base text-pretty">
            {copy}
          </p>
        )}
        <SectionDivider className="mt-2 w-full" />
      </div>
    </section>
  )
}

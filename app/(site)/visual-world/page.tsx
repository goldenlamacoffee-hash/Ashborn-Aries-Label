import type { Metadata } from "next"
import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { SectionDivider } from "@/components/section-divider"

export const metadata: Metadata = {
  title: "Visual World",
  description:
    "The visual language of Ashborn Aries Label — fire and ash, black roads, ink and bronze. A world built from darkness and ember light.",
}

const visuals = [
  {
    src: "/images/visual/fire-ash.png",
    alt: "Glowing embers seeping through cracked charred wood",
    title: "Fire & Ash",
    text: "Everything we release passes through fire. What survives is what we keep — the ember beneath the char, the glow that refuses to die.",
  },
  {
    src: "/images/visual/black-road.png",
    alt: "Empty black road at night with a faint ember glow on the horizon",
    title: "The Black Road",
    text: "The long road at night is where our stories live. Lonely, unlit, honest. You walk it alone, but the horizon always burns.",
  },
  {
    src: "/images/visual/tattoo-marks.png",
    alt: "Black traditional tattoo flash linework of horns, thorns and flames on aged paper",
    title: "Ink & Marks",
    text: "Ink is memory that cannot be erased. Ram horns, thorns, flame and arrow — the marks we carry are the songs we sing.",
  },
  {
    src: "/images/visual/bronze-ember.png",
    alt: "Antique bronze metallic texture fading into charcoal shadow with floating embers",
    title: "Bronze & Ember",
    text: "Our metal is not polished gold. It is weathered bronze — beaten, aged, and warm. Light that earned its patina.",
  },
]

export default function VisualWorldPage() {
  return (
    <>
      <PageHero
        eyebrow="The Aesthetic"
        title="Visual World"
        description="Darkness is our canvas. Ember is our light. This is the world every release, every frame, and every mark belongs to."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-20">
          {visuals.map((v, i) => (
            <article
              key={v.title}
              className={`flex flex-col gap-8 md:items-center ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-border md:w-3/5">
                <Image
                  src={v.src || "/placeholder.svg"}
                  alt={v.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="md:w-2/5">
                <h2 className="font-serif text-3xl text-foreground text-balance">{v.title}</h2>
                <SectionDivider className="my-5" align="left" />
                <p className="leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-serif text-2xl leading-relaxed text-foreground text-balance">
            {'"We do not decorate the dark. We live in it — and we carry the fire with us."'}
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-accent">Ashborn Aries Label</p>
        </div>
      </section>
    </>
  )
}

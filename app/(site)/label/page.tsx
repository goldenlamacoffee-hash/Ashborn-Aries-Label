import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { BronzePanel } from '@/components/bronze-panel'
import { EmberButton } from '@/components/ember-button'
import { SectionDivider } from '@/components/section-divider'

export const metadata: Metadata = {
  title: 'The Label',
  description:
    'Ashborn Aries Label — an independent music label and creative house for dark country, Southern gothic, cinematic western, sax lounge, and emotional instrumental music.',
}

const pillars = [
  {
    title: 'Independent Label',
    copy: 'Fully independent. No committee decides what burns. Releases, publishing, and identity are all held under one roof — the ram answers to no one.',
  },
  {
    title: 'Music with Scars',
    copy: 'We sign songs, not trends. Everything released here carries weight: pain, discipline, love, loss, and the marks they leave behind.',
  },
  {
    title: 'Artist-First Storytelling',
    copy: 'Every project is built around story and identity. Albums are chapters, tracks are verses, and the visual world is part of the record.',
  },
  {
    title: 'Releases & Publishing',
    copy: 'The label handles release strategy, catalog management, metadata, and publishing administration for every project under the mark.',
  },
  {
    title: 'Licensing & Collaborations',
    copy: 'Cinematic western, dark country, and instrumental catalog available for film, series, trailers, and brand work. Serious inquiries through the contact page.',
  },
  {
    title: 'Future Roster',
    copy: 'The herd will grow. The label is built to carry more projects — dark country voices, instrumental composers, and session series that fit the fire.',
  },
]

export default function LabelPage() {
  return (
    <>
      <PageHero
        eyebrow="Est. MMXXV"
        title="Ashborn Aries Label"
        copy="Ashborn Aries Label is an independent music label and creative house for dark country, Southern gothic, cinematic western, sax lounge, and emotional instrumental music. We build music around story, identity, and atmosphere — not trends."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <BronzePanel key={pillar.title} className="flex flex-col gap-4 p-7">
              <h2 className="font-serif text-lg font-semibold uppercase tracking-wide text-gold text-balance">
                {pillar.title}
              </h2>
              <div className="bronze-divider w-16" />
              <p className="font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
                {pillar.copy}
              </p>
            </BronzePanel>
          ))}
        </div>
      </section>

      {/* Emblem statement */}
      <section className="relative overflow-hidden border-t border-bronze/20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/images/visual/bronze-ember.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center md:px-6 md:py-28">
          <Image
            src="/images/ram-emblem.png"
            alt="Ashborn Aries Label ram emblem"
            width={120}
            height={120}
            className="h-28 w-28 rounded-full border border-bronze/50 object-cover"
          />
          <h2 className="foil-text font-serif text-2xl font-bold uppercase tracking-wide md:text-3xl text-balance">
            Forged in Fire. Built to Last.
          </h2>
          <SectionDivider className="w-full" />
          <p className="font-sans text-sm leading-relaxed text-muted-foreground md:text-base text-pretty">
            For licensing, press, booking, or label inquiries, reach the label directly. Every
            serious message gets a serious answer.
          </p>
          <EmberButton href="/contact" className="mt-2">
            Contact the Label
          </EmberButton>
        </div>
      </section>
    </>
  )
}

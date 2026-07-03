import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { ContactForm } from "@/components/contact-form"
import { NewsletterSignup } from "@/components/newsletter-signup"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Ashborn Aries Label for licensing, press, collaboration, or anything worth saying. We read everything that comes through the fire.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Reach Us"
        title="Contact"
        description="Licensing, press, collaboration — or anything worth saying. Keep it honest. We answer what matters."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-16 md:flex-row">
          <div className="md:w-3/5">
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-10 md:w-2/5">
            <div className="border border-border bg-card p-8">
              <h2 className="font-serif text-xl text-foreground">Direct</h2>
              <div className="mt-5 flex flex-col gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">General</p>
                  <a
                    href="mailto:contact@ashbornaries.com"
                    className="mt-1 inline-block text-foreground transition-colors hover:text-accent"
                  >
                    contact@ashbornaries.com
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Licensing &amp; Sync</p>
                  <a
                    href="mailto:licensing@ashbornaries.com"
                    className="mt-1 inline-block text-foreground transition-colors hover:text-accent"
                  >
                    licensing@ashbornaries.com
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Press</p>
                  <a
                    href="mailto:press@ashbornaries.com"
                    className="mt-1 inline-block text-foreground transition-colors hover:text-accent"
                  >
                    press@ashbornaries.com
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-border bg-card p-8">
              <h2 className="font-serif text-xl text-foreground">From the Ashes</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                New releases, stories behind the songs, and nothing else. No noise.
              </p>
              <div className="mt-5">
                <NewsletterSignup compact />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

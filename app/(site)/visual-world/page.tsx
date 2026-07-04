import type { Metadata } from "next"
import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { SectionDivider } from "@/components/section-divider"
import { getPublishedGalleryCollections } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Visual World",
  description:
    "The visual language of Ashborn Aries Label — fire and ash, black roads, ink and bronze. A world built from darkness and ember light.",
}

export default async function VisualWorldPage() {
  const collections = await getPublishedGalleryCollections()
  const withItems = collections.filter((c) => c.items.length > 0)

  return (
    <>
      <PageHero
        eyebrow="The Aesthetic"
        title="Visual World"
        copy="Darkness is our canvas. Ember is our light. This is the world every release, every frame, and every mark belongs to."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-24">
          {withItems.map((collection) => (
            <div key={collection.id} className="flex flex-col gap-12">
              <header className="max-w-2xl">
                <h2 className="font-serif text-3xl text-foreground text-balance">
                  {collection.title}
                </h2>
                <SectionDivider className="my-5" align="left" />
                {collection.description && (
                  <p className="leading-relaxed text-muted-foreground text-pretty">
                    {collection.description}
                  </p>
                )}
              </header>

              {collection.items.length === 1 ? (
                <SingleItem item={collection.items[0]} />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {collection.items.map((item) => (
                    <figure key={item.id} className="group flex flex-col">
                      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border">
                        <Image
                          src={item.asset.url || "/placeholder.svg"}
                          alt={item.asset.altText || item.title || collection.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                      </div>
                      {(item.title || item.caption || item.asset.caption) && (
                        <figcaption className="px-1 pt-3">
                          {item.title && (
                            <p className="font-serif text-lg text-foreground">{item.title}</p>
                          )}
                          {(item.caption || item.asset.caption) && (
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {item.caption || item.asset.caption}
                            </p>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </div>
          ))}

          {withItems.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              The visual archive is being restocked. Return soon.
            </p>
          )}
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

function SingleItem({
  item,
}: {
  item: Awaited<ReturnType<typeof getPublishedGalleryCollections>>[number]["items"][number]
}) {
  return (
    <article className="flex flex-col gap-8 md:flex-row md:items-center">
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-border md:w-3/5">
        <Image
          src={item.asset.url || "/placeholder.svg"}
          alt={item.asset.altText || item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      <div className="md:w-2/5">
        {item.title && <h3 className="font-serif text-2xl text-foreground text-balance">{item.title}</h3>}
        {(item.caption || item.asset.caption) && (
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {item.caption || item.asset.caption}
          </p>
        )}
      </div>
    </article>
  )
}

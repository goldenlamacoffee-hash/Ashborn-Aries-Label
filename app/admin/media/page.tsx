import Image from "next/image"
import { AdminPageHeader } from "@/components/admin/admin-ui"

const assets = [
  { src: "/images/ram-emblem.png", name: "Ram emblem", usage: "Logo, header, OG image" },
  { src: "/images/hero-bg.png", name: "Hero background", usage: "Homepage hero" },
  { src: "/images/covers/ex-igne-et-dolore.png", name: "Ex Igne et Dolore", usage: "Album cover" },
  { src: "/images/covers/black-ink-salvation.png", name: "Black Ink Salvation", usage: "Album cover" },
  { src: "/images/covers/still-standing-in-the-fire.png", name: "Still Standing in the Fire", usage: "Single cover" },
  { src: "/images/covers/afterglow-sax.png", name: "Afterglow", usage: "Sax album cover" },
  { src: "/images/covers/velvet-rain-sax.png", name: "Velvet Rain", usage: "Sax album cover" },
  { src: "/images/covers/morning-glow-sax.png", name: "Morning Glow", usage: "Sax album cover" },
  { src: "/images/artists/ashborn-aries.png", name: "Ashborn Aries", usage: "Artist visual" },
  { src: "/images/artists/golden-lama-sax.png", name: "Golden Lama Sax", usage: "Artist visual" },
  { src: "/images/artists/ashborn-instrumentals.png", name: "Ashborn Instrumentals", usage: "Artist visual" },
  { src: "/images/visual/fire-ash.png", name: "Fire & Ash", usage: "Visual World" },
  { src: "/images/visual/black-road.png", name: "The Black Road", usage: "Visual World" },
  { src: "/images/visual/tattoo-marks.png", name: "Ink & Marks", usage: "Visual World" },
  { src: "/images/visual/bronze-ember.png", name: "Bronze & Ember", usage: "Visual World" },
]

export default function AdminMediaPage() {
  return (
    <>
      <AdminPageHeader
        title="Media / Gallery"
        description="All visual assets currently in use across the site. Upload and replace support arrives with Blob storage."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {assets.map((a) => (
          <figure key={a.src} className="border border-border bg-card">
            <div className="relative aspect-square">
              <Image
                src={a.src || "/placeholder.svg"}
                alt={a.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <figcaption className="p-3">
              <p className="text-sm text-foreground">{a.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.usage}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}

import Link from "next/link"
import { releases, artists } from "@/lib/data"
import { AdminPageHeader, StatCard } from "@/components/admin/admin-ui"

export default function AdminDashboard() {
  const trackCount = releases.reduce((n, r) => n + r.tracks.length, 0)
  const albums = releases.filter((r) => r.type === "album").length
  const singles = releases.filter((r) => r.type === "single").length

  const quickLinks = [
    { href: "/admin/releases", label: "Manage Releases", note: "Covers, dates, streaming links" },
    { href: "/admin/tracks", label: "Edit Tracks & Lyrics", note: "Lyrics, story notes, credits" },
    { href: "/admin/artists", label: "Manage Artists", note: "Bios, images, project links" },
    { href: "/admin/settings", label: "Site Settings", note: "Hero text, SEO, social, contact" },
  ]

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of the Ashborn Aries Label catalog. All content is seeded and editable; connect a database (Neon) later to persist changes."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Releases" value={String(releases.length)} sub={`${albums} albums \u00B7 ${singles} singles`} />
        <StatCard label="Tracks" value={String(trackCount)} sub="With lyrics & story notes" />
        <StatCard label="Artists / Projects" value={String(artists.length)} sub="Editable placeholder profiles" />
        <StatCard label="Subscribers" value="0" sub="Newsletter — awaiting database" />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-foreground">Quick actions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group border border-border bg-card p-6 transition-colors hover:border-accent/60"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-foreground group-hover:text-accent">
                {l.label}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{l.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">Latest releases</h2>
        <ul className="mt-4 divide-y divide-border">
          {releases.slice(0, 5).map((r) => (
            <li key={r.slug} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.artistName} {"\u00B7"} {r.type} {"\u00B7"} {r.releaseDate}
                </p>
              </div>
              <Link
                href="/admin/releases"
                className="text-xs uppercase tracking-widest text-accent hover:text-foreground"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

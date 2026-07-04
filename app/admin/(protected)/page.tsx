import Link from 'next/link'
import { adminGetStats, adminListReleases } from '@/app/actions/admin'
import { AdminPageHeader, StatCard } from '@/components/admin/admin-ui'

export default async function AdminDashboard() {
  const [stats, releases] = await Promise.all([adminGetStats(), adminListReleases()])

  const quickLinks = [
    { href: '/admin/releases', label: 'Manage Releases', note: 'Covers, dates, streaming links' },
    { href: '/admin/tracks', label: 'Edit Tracks & Lyrics', note: 'Lyrics, story notes, credits' },
    { href: '/admin/artists', label: 'Manage Artists', note: 'Bios, images, project links' },
    { href: '/admin/messages', label: 'Messages', note: `${stats.messagesUnread} unread` },
    { href: '/admin/newsletter', label: 'Newsletter', note: `${stats.subscribers} subscribers` },
    { href: '/admin/settings', label: 'Site Settings', note: 'Hero text, SEO, social, contact' },
  ]

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of the Ashborn Aries Label catalog. All content is stored in the database — changes go live immediately."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Releases"
          value={String(stats.releases)}
          sub={`${stats.releasesPublished} published`}
        />
        <StatCard label="Tracks" value={String(stats.tracks)} sub="With lyrics & story notes" />
        <StatCard label="Artists / Projects" value={String(stats.artists)} sub="On the roster" />
        <StatCard
          label="Subscribers"
          value={String(stats.subscribers)}
          sub={`${stats.messagesUnread} unread message${stats.messagesUnread === 1 ? '' : 's'}`}
        />
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
                  {r.type} {'\u00B7'} {r.releaseDate} {'\u00B7'}{' '}
                  {r.published ? 'Published' : 'Draft'}
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

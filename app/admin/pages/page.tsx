import Link from "next/link"
import { AdminPageHeader, AdminTable } from "@/components/admin/admin-ui"

const pages = [
  { route: "/", name: "Home", editable: "Hero text, featured release, mood teasers", status: "Live" },
  { route: "/releases", name: "Releases", editable: "Catalog grid, filters", status: "Live" },
  { route: "/artists", name: "Artists", editable: "Project profiles", status: "Live" },
  { route: "/lyrics", name: "Lyrics & Stories", editable: "Albums, tracks, lyrics, story notes", status: "Live" },
  { route: "/label", name: "Label", editable: "Story, values, services", status: "Live" },
  { route: "/visual-world", name: "Visual World", editable: "Aesthetic sections, imagery", status: "Live" },
  { route: "/contact", name: "Contact", editable: "Contact emails, form purposes", status: "Live" },
]

export default function AdminPagesPage() {
  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Every public page and what it exposes for editing. Page copy lives in the data layer (lib/data.ts) and moves to the database when connected."
      />

      <AdminTable headers={["Page", "Route", "Editable content", "Status", ""]}>
        {pages.map((p) => (
          <tr key={p.route}>
            <td className="px-4 py-3 text-foreground">{p.name}</td>
            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.route}</td>
            <td className="px-4 py-3 text-muted-foreground">{p.editable}</td>
            <td className="px-4 py-3">
              <span className="border border-accent/40 px-2 py-1 text-[10px] uppercase tracking-widest text-accent">
                {p.status}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                href={p.route}
                className="text-xs uppercase tracking-widest text-accent hover:text-foreground"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </AdminTable>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Hero text, SEO metadata, contact email, and social links are edited under{" "}
        <Link href="/admin/settings" className="text-accent hover:text-foreground">
          Settings
        </Link>
        . Release and lyric content is edited under Releases and Tracks / Lyrics.
      </p>
    </>
  )
}

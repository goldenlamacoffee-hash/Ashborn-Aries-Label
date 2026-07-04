"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/releases", label: "Releases" },
  { href: "/admin/tracks", label: "Tracks / Lyrics" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
]

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode
  userName?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/images/brand/brand-seal.webp" alt="" width={32} height={32} className="rounded-full" />
          <span className="font-serif text-sm tracking-[0.2em] text-foreground">AAL ADMIN</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle admin navigation"
          className="border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground"
        >
          Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "border-b border-border bg-card md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r",
          open ? "block" : "hidden md:block",
        )}
      >
        <div className="hidden items-center gap-3 border-b border-border px-6 py-5 md:flex">
          <Image src="/images/brand/brand-seal.webp" alt="" width={36} height={36} className="rounded-full" />
          <div>
            <p className="font-serif text-sm tracking-[0.2em] text-foreground">AAL ADMIN</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Label CMS</p>
          </div>
        </div>
        <nav aria-label="Admin" className="flex flex-col p-3">
          {navItems.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-l-2 px-4 py-3 text-sm transition-colors",
                  active
                    ? "border-accent bg-secondary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex flex-col gap-3 border-t border-border p-4">
          {userName && (
            <p className="truncate font-sans text-xs text-muted-foreground" title={userName}>
              {userName}
            </p>
          )}
          <Link href="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
            {"\u2190 Back to site"}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-left text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  )
}

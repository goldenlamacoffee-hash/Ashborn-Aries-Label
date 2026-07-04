"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function AdminPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-serif text-3xl text-foreground text-balance">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{description}</p> : null}
      <div className="bronze-divider mt-5 max-w-40" />
    </header>
  )
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">{children}</tbody>
      </table>
    </div>
  )
}

export function AdminField({
  label,
  id,
  hint,
  children,
}: {
  label: string
  id: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground/70">{hint}</p> : null}
    </div>
  )
}

export const adminInputClass =
  "w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"

export function SaveButton({ onClick, className }: { onClick?: () => void; className?: string }) {
  const [saved, setSaved] = useState(false)

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={() => {
          onClick?.()
          setSaved(true)
          setTimeout(() => setSaved(false), 2500)
        }}
        className="border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5"
      >
        Save Changes
      </button>
      <span aria-live="polite" className={cn("text-xs text-accent transition-opacity", saved ? "opacity-100" : "opacity-0")}>
        Saved to the database.
      </span>
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-border bg-card p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-3xl text-foreground">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  )
}

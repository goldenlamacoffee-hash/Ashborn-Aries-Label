"use client"

import { useState } from "react"
import Image from "next/image"
import { artists as seededArtists, type Artist } from "@/lib/data"
import { AdminPageHeader, AdminTable, AdminField, SaveButton, adminInputClass } from "@/components/admin/admin-ui"

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(seededArtists)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  const editing = artists.find((a) => a.slug === editingSlug) ?? null

  function updateEditing(patch: Partial<Artist>) {
    if (!editing) return
    setArtists((prev) => prev.map((a) => (a.slug === editing.slug ? { ...a, ...patch } : a)))
  }

  return (
    <>
      <AdminPageHeader
        title="Artists / Projects"
        description="Manage the label's artist projects: names, roles, bios, images, and links. All profiles are clearly editable placeholders."
      />

      <AdminTable headers={["Image", "Name", "Role", "Status", ""]}>
        {artists.map((a) => (
          <tr key={a.slug}>
            <td className="px-4 py-3">
              <Image
                src={a.image || "/placeholder.svg"}
                alt={`${a.name} visual`}
                width={44}
                height={44}
                className="border border-border object-cover"
              />
            </td>
            <td className="px-4 py-3 text-foreground">{a.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{a.role}</td>
            <td className="px-4 py-3 text-muted-foreground">{a.placeholder ? "Editable placeholder" : "Live"}</td>
            <td className="px-4 py-3 text-right">
              <button
                type="button"
                onClick={() => setEditingSlug(a.slug === editingSlug ? null : a.slug)}
                className="text-xs uppercase tracking-widest text-accent hover:text-foreground"
              >
                {editingSlug === a.slug ? "Close" : "Edit"}
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>

      {editing ? (
        <section className="mt-8 border border-border bg-card p-6" aria-label={`Edit ${editing.name}`}>
          <h2 className="font-serif text-xl text-foreground">Editing: {editing.name}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <AdminField label="Name" id="art-name">
              <input
                id="art-name"
                className={adminInputClass}
                value={editing.name}
                onChange={(e) => updateEditing({ name: e.target.value })}
              />
            </AdminField>
            <AdminField label="Role" id="art-role">
              <input
                id="art-role"
                className={adminInputClass}
                value={editing.role}
                onChange={(e) => updateEditing({ role: e.target.value })}
              />
            </AdminField>
            <div className="md:col-span-2">
              <AdminField label="Tagline" id="art-tagline">
                <input
                  id="art-tagline"
                  className={adminInputClass}
                  value={editing.tagline}
                  onChange={(e) => updateEditing({ tagline: e.target.value })}
                />
              </AdminField>
            </div>
            <div className="md:col-span-2">
              <AdminField label="Bio" id="art-bio" hint="Separate paragraphs with a blank line.">
                <textarea
                  id="art-bio"
                  rows={8}
                  className={adminInputClass}
                  value={editing.bio.join("\n\n")}
                  onChange={(e) => updateEditing({ bio: e.target.value.split(/\n\s*\n/) })}
                />
              </AdminField>
            </div>
            <AdminField label="Image path" id="art-image" hint="Upload support arrives with Blob storage.">
              <input
                id="art-image"
                className={adminInputClass}
                value={editing.image}
                onChange={(e) => updateEditing({ image: e.target.value })}
              />
            </AdminField>
            <AdminField label="Press kit note" id="art-press">
              <input
                id="art-press"
                className={adminInputClass}
                value={editing.pressKitNote}
                onChange={(e) => updateEditing({ pressKitNote: e.target.value })}
              />
            </AdminField>
          </div>
          <SaveButton className="mt-8" />
        </section>
      ) : null}
    </>
  )
}

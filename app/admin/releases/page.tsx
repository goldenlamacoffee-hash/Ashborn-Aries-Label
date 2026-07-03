"use client"

import { useState } from "react"
import Image from "next/image"
import { releases as seededReleases, type Release } from "@/lib/data"
import { AdminPageHeader, AdminTable, AdminField, SaveButton, adminInputClass } from "@/components/admin/admin-ui"

export default function AdminReleasesPage() {
  const [releases, setReleases] = useState<Release[]>(seededReleases)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  const editing = releases.find((r) => r.slug === editingSlug) ?? null

  function updateEditing(patch: Partial<Release>) {
    if (!editing) return
    setReleases((prev) => prev.map((r) => (r.slug === editing.slug ? { ...r, ...patch } : r)))
  }

  return (
    <>
      <AdminPageHeader
        title="Releases"
        description="Manage albums and singles: metadata, cover art, moods, and streaming links."
      />

      <AdminTable headers={["Cover", "Title", "Artist", "Type", "Date", ""]}>
        {releases.map((r) => (
          <tr key={r.slug}>
            <td className="px-4 py-3">
              <Image
                src={r.coverImage || "/placeholder.svg"}
                alt={`${r.title} cover art`}
                width={44}
                height={44}
                className="border border-border object-cover"
              />
            </td>
            <td className="px-4 py-3 text-foreground">{r.title}</td>
            <td className="px-4 py-3 text-muted-foreground">{r.artistName}</td>
            <td className="px-4 py-3 capitalize text-muted-foreground">{r.type}</td>
            <td className="px-4 py-3 text-muted-foreground">{r.releaseDate}</td>
            <td className="px-4 py-3 text-right">
              <button
                type="button"
                onClick={() => setEditingSlug(r.slug === editingSlug ? null : r.slug)}
                className="text-xs uppercase tracking-widest text-accent hover:text-foreground"
              >
                {editingSlug === r.slug ? "Close" : "Edit"}
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>

      {editing ? (
        <section className="mt-8 border border-border bg-card p-6" aria-label={`Edit ${editing.title}`}>
          <h2 className="font-serif text-xl text-foreground">Editing: {editing.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <AdminField label="Title" id="rel-title">
              <input
                id="rel-title"
                className={adminInputClass}
                value={editing.title}
                onChange={(e) => updateEditing({ title: e.target.value })}
              />
            </AdminField>
            <AdminField label="Release date" id="rel-date">
              <input
                id="rel-date"
                className={adminInputClass}
                value={editing.releaseDate}
                onChange={(e) => updateEditing({ releaseDate: e.target.value })}
              />
            </AdminField>
            <AdminField label="Mood" id="rel-mood">
              <input
                id="rel-mood"
                className={adminInputClass}
                value={editing.mood}
                onChange={(e) => updateEditing({ mood: e.target.value })}
              />
            </AdminField>
            <AdminField label="Cover image path" id="rel-cover" hint="Upload support arrives with Blob storage.">
              <input
                id="rel-cover"
                className={adminInputClass}
                value={editing.coverImage}
                onChange={(e) => updateEditing({ coverImage: e.target.value })}
              />
            </AdminField>
            <div className="md:col-span-2">
              <AdminField label="Description" id="rel-desc">
                <textarea
                  id="rel-desc"
                  rows={3}
                  className={adminInputClass}
                  value={editing.description}
                  onChange={(e) => updateEditing({ description: e.target.value })}
                />
              </AdminField>
            </div>
            <AdminField label="Spotify link" id="rel-spotify">
              <input
                id="rel-spotify"
                className={adminInputClass}
                value={editing.streaming.spotify ?? ""}
                placeholder="https://open.spotify.com/..."
                onChange={(e) => updateEditing({ streaming: { ...editing.streaming, spotify: e.target.value } })}
              />
            </AdminField>
            <AdminField label="Apple Music link" id="rel-apple">
              <input
                id="rel-apple"
                className={adminInputClass}
                value={editing.streaming.appleMusic ?? ""}
                placeholder="https://music.apple.com/..."
                onChange={(e) => updateEditing({ streaming: { ...editing.streaming, appleMusic: e.target.value } })}
              />
            </AdminField>
            <AdminField label="YouTube link" id="rel-youtube">
              <input
                id="rel-youtube"
                className={adminInputClass}
                value={editing.streaming.youtube ?? ""}
                placeholder="https://youtube.com/..."
                onChange={(e) => updateEditing({ streaming: { ...editing.streaming, youtube: e.target.value } })}
              />
            </AdminField>
          </div>
          <SaveButton className="mt-8" />
        </section>
      ) : null}
    </>
  )
}

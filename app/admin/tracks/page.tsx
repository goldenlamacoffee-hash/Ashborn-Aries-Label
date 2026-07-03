"use client"

import { useMemo, useState } from "react"
import { releases as seededReleases, type Release, type Track } from "@/lib/data"
import { AdminPageHeader, AdminField, SaveButton, adminInputClass } from "@/components/admin/admin-ui"

export default function AdminTracksPage() {
  const [releases, setReleases] = useState<Release[]>(seededReleases)
  const withTracks = useMemo(() => releases.filter((r) => r.tracks.length > 0), [releases])

  const [releaseSlug, setReleaseSlug] = useState(withTracks[0]?.slug ?? "")
  const release = withTracks.find((r) => r.slug === releaseSlug) ?? withTracks[0]

  const [trackSlug, setTrackSlug] = useState(release?.tracks[0]?.slug ?? "")
  const track = release?.tracks.find((t) => t.slug === trackSlug) ?? release?.tracks[0]

  function updateTrack(patch: Partial<Track>) {
    if (!release || !track) return
    setReleases((prev) =>
      prev.map((r) =>
        r.slug === release.slug
          ? { ...r, tracks: r.tracks.map((t) => (t.slug === track.slug ? { ...t, ...patch } : t)) }
          : r,
      ),
    )
  }

  if (!release || !track) {
    return <AdminPageHeader title="Tracks / Lyrics" description="No tracks found in the catalog yet." />
  }

  return (
    <>
      <AdminPageHeader
        title="Tracks / Lyrics"
        description="Edit lyrics stanza by stanza, along with story notes, spoken intros/outros, and credits. Lyrics are never hardcoded into components."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Release" id="sel-release">
          <select
            id="sel-release"
            className={adminInputClass}
            value={release.slug}
            onChange={(e) => {
              setReleaseSlug(e.target.value)
              const next = withTracks.find((r) => r.slug === e.target.value)
              setTrackSlug(next?.tracks[0]?.slug ?? "")
            }}
          >
            {withTracks.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title} {"\u2014"} {r.artistName}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Track" id="sel-track">
          <select
            id="sel-track"
            className={adminInputClass}
            value={track.slug}
            onChange={(e) => setTrackSlug(e.target.value)}
          >
            {release.tracks.map((t, i) => (
              <option key={t.slug} value={t.slug}>
                {i + 1}. {t.title}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <section className="mt-8 border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">
          {release.title} {"\u2014"} {track.title}
        </h2>

        <div className="mt-6 flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AdminField label="Track title" id="trk-title">
              <input
                id="trk-title"
                className={adminInputClass}
                value={track.title}
                onChange={(e) => updateTrack({ title: e.target.value })}
              />
            </AdminField>
            <AdminField label="Duration" id="trk-duration">
              <input
                id="trk-duration"
                className={adminInputClass}
                value={track.duration ?? ""}
                placeholder="3:42"
                onChange={(e) => updateTrack({ duration: e.target.value })}
              />
            </AdminField>
          </div>

          <AdminField label="Story note" id="trk-story" hint="Shown as 'The story behind the song' on the lyrics page.">
            <textarea
              id="trk-story"
              rows={3}
              className={adminInputClass}
              value={track.storyNote}
              onChange={(e) => updateTrack({ storyNote: e.target.value })}
            />
          </AdminField>

          <div className="grid gap-6 md:grid-cols-2">
            <AdminField label="Spoken intro (optional)" id="trk-intro">
              <textarea
                id="trk-intro"
                rows={2}
                className={adminInputClass}
                value={track.spokenIntro ?? ""}
                onChange={(e) => updateTrack({ spokenIntro: e.target.value })}
              />
            </AdminField>
            <AdminField label="Spoken outro (optional)" id="trk-outro">
              <textarea
                id="trk-outro"
                rows={2}
                className={adminInputClass}
                value={track.spokenOutro ?? ""}
                onChange={(e) => updateTrack({ spokenOutro: e.target.value })}
              />
            </AdminField>
          </div>

          <AdminField
            label="Lyrics"
            id="trk-lyrics"
            hint="Separate stanzas with a blank line. Placeholder lyrics remain editable until final lyrics are set."
          >
            <textarea
              id="trk-lyrics"
              rows={14}
              className={`${adminInputClass} font-mono leading-relaxed`}
              value={track.lyrics.join("\n\n")}
              onChange={(e) => updateTrack({ lyrics: e.target.value.split(/\n\s*\n/) })}
            />
          </AdminField>

          <AdminField label="Credits" id="trk-credits" hint="One credit line per row.">
            <textarea
              id="trk-credits"
              rows={4}
              className={adminInputClass}
              value={track.credits.join("\n")}
              onChange={(e) => updateTrack({ credits: e.target.value.split("\n") })}
            />
          </AdminField>
        </div>

        <SaveButton className="mt-8" />
      </section>
    </>
  )
}

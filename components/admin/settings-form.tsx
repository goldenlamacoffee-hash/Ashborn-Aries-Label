'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminSetSetting } from '@/app/actions/admin'
import { AdminField, adminInputClass } from '@/components/admin/admin-ui'
import { MediaPicker } from '@/components/admin/media-picker'
import type { SiteSettings } from '@/lib/data'

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>(initial)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }

  async function handleSave() {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await adminSetSetting('site', settings as unknown as Record<string, unknown>)
      setSaved(true)
      router.refresh()
    } catch {
      setError('Save failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">Homepage hero</h2>
        <div className="mt-6 flex flex-col gap-6">
          <AdminField label="Headline" id="set-headline">
            <input
              id="set-headline"
              className={adminInputClass}
              value={settings.heroHeadline}
              onChange={(e) => update({ heroHeadline: e.target.value })}
            />
          </AdminField>
          <AdminField label="Subtitle" id="set-subtitle">
            <input
              id="set-subtitle"
              className={adminInputClass}
              value={settings.heroSubtitle}
              onChange={(e) => update({ heroSubtitle: e.target.value })}
            />
          </AdminField>
          <AdminField label="Hero copy" id="set-copy">
            <textarea
              id="set-copy"
              rows={3}
              className={adminInputClass}
              value={settings.heroCopy}
              onChange={(e) => update({ heroCopy: e.target.value })}
            />
          </AdminField>
        </div>
      </section>

      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">Branding & media</h2>
        <div className="mt-6 flex flex-col gap-6">
          <MediaPicker
            label="Main logo / brand seal"
            value={settings.logoUrl}
            onChange={(url) => update({ logoUrl: url })}
            categoryHint="logo"
            hint="Used in the site header, footer, and admin."
          />
          <MediaPicker
            label="Homepage hero image (desktop)"
            value={settings.heroImage}
            onChange={(url) => update({ heroImage: url })}
            categoryHint="hero-background"
            hint="Wide, decorative artwork behind the homepage hero. Must NOT contain baked-in text — the headline is added as live text on top."
          />
          <MediaPicker
            label="Homepage hero image (mobile)"
            value={settings.heroMobileImage}
            onChange={(url) => update({ heroMobileImage: url })}
            categoryHint="hero-background"
            hint="Portrait-friendly crop shown on phones. Leave empty to reuse the desktop image."
          />
          <AdminField
            label={`Hero overlay darkness (${settings.heroOverlayStrength ?? 70}%)`}
            id="set-hero-overlay"
          >
            <input
              id="set-hero-overlay"
              type="range"
              min={0}
              max={100}
              step={5}
              className="w-full accent-primary"
              value={settings.heroOverlayStrength ?? 70}
              onChange={(e) => update({ heroOverlayStrength: Number(e.target.value) })}
            />
          </AdminField>
          <MediaPicker
            label="Default OG / social share image"
            value={settings.ogImage}
            onChange={(url) => update({ ogImage: url })}
            categoryHint="seo-og"
            hint="Shown when pages are shared on social platforms."
          />
          <MediaPicker
            label="Footer logo (optional)"
            value={settings.footerLogoUrl}
            onChange={(url) => update({ footerLogoUrl: url })}
            categoryHint="logo"
            hint="Overrides the main logo in the footer. Leave empty to reuse the main logo."
          />
          <MediaPicker
            label="Favicon (optional)"
            value={settings.faviconUrl}
            onChange={(url) => update({ faviconUrl: url })}
            categoryHint="logo"
            hint="Browser tab icon. Square images work best."
          />
          <MediaPicker
            label="Interior page hero background"
            value={settings.pageHeroBackground}
            onChange={(url) => update({ pageHeroBackground: url })}
            categoryHint="hero-background"
            hint="Background behind the header of Releases, Artists, Lyrics, Label, Contact, and Visual World pages."
          />
          <MediaPicker
            label="Label page section background"
            value={settings.labelSectionBackground}
            onChange={(url) => update({ labelSectionBackground: url })}
            categoryHint="section-background"
            hint="Background of the emblem statement section on the Label page."
          />
          <MediaPicker
            label="Homepage story section background"
            value={settings.homeSectionBackground}
            onChange={(url) => update({ homeSectionBackground: url })}
            categoryHint="section-background"
            hint="Background of the label story section on the homepage."
          />
        </div>
      </section>

      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">SEO metadata</h2>
        <div className="mt-6 flex flex-col gap-6">
          <AdminField label="Site name" id="set-sitename">
            <input
              id="set-sitename"
              className={adminInputClass}
              value={settings.siteName}
              onChange={(e) => update({ siteName: e.target.value })}
            />
          </AdminField>
          <AdminField label="Tagline" id="set-tagline">
            <input
              id="set-tagline"
              className={adminInputClass}
              value={settings.tagline}
              onChange={(e) => update({ tagline: e.target.value })}
            />
          </AdminField>
          <AdminField label="Domain" id="set-domain">
            <input
              id="set-domain"
              className={adminInputClass}
              value={settings.domain}
              onChange={(e) => update({ domain: e.target.value })}
            />
          </AdminField>
        </div>
      </section>

      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">Contact & social</h2>
        <div className="mt-6 flex flex-col gap-6">
          <AdminField label="Contact email" id="set-email">
            <input
              id="set-email"
              type="email"
              className={adminInputClass}
              value={settings.contactEmail}
              onChange={(e) => update({ contactEmail: e.target.value })}
            />
          </AdminField>
          <AdminField label="Footer line" id="set-footer">
            <input
              id="set-footer"
              className={adminInputClass}
              value={settings.footerLine}
              onChange={(e) => update({ footerLine: e.target.value })}
            />
          </AdminField>
          {settings.social.map((s, i) => (
            <AdminField key={s.label} label={`${s.label} URL`} id={`set-social-${i}`}>
              <input
                id={`set-social-${i}`}
                className={adminInputClass}
                value={s.href}
                placeholder="https://..."
                onChange={(e) =>
                  update({
                    social: settings.social.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)),
                  })
                }
              />
            </AdminField>
          ))}
        </div>
      </section>

      {error && (
        <p role="alert" className="text-xs text-ember">
          {error}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save Changes'}
        </button>
        <span aria-live="polite" className={saved ? 'text-xs text-accent' : 'sr-only'}>
          Saved to the database.
        </span>
      </div>
    </div>
  )
}

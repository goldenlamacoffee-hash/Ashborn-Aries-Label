"use client"

import { useState } from "react"
import { siteSettings as seeded, type SiteSettings } from "@/lib/data"
import { AdminPageHeader, AdminField, SaveButton, adminInputClass } from "@/components/admin/admin-ui"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(seeded)

  function update(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Homepage hero text, SEO metadata, contact email, and social links."
      />

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

        <SaveButton />
      </div>
    </>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { siteSettings } from '@/lib/data'

const columns = [
  {
    heading: 'Explore',
    links: [
      { href: '/releases', label: 'Releases' },
      { href: '/artists', label: 'Artists' },
      { href: '/lyrics', label: 'Lyrics & Stories' },
      { href: '/visual-world', label: 'Visual World' },
    ],
  },
  {
    heading: 'Label',
    links: [
      { href: '/label', label: 'About the Label' },
      { href: '/contact', label: 'Licensing' },
      { href: '/contact', label: 'Press' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-bronze/30 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14 md:flex-row md:justify-between md:px-6">
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/brand/brand-seal.webp"
              alt="Ashborn Aries Label brand seal"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border border-bronze/40 object-cover"
            />
            <div className="flex flex-col">
              <span className="font-display text-base font-bold uppercase tracking-[0.2em] text-gold">
                Ashborn Aries Label
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                {siteSettings.tagline}
              </span>
            </div>
          </div>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Independent label for dark country, Southern gothic, cinematic western, sax lounge, and
            emotional instrumental music.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          {columns.map((col) => (
            <nav key={col.heading} aria-label={`Footer — ${col.heading}`}>
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-muted-foreground transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Footer — Follow">
            <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Follow
            </h3>
            <ul className="flex flex-col gap-2">
              {siteSettings.social.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="font-sans text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-bronze/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center md:flex-row md:px-6 md:text-left">
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            {siteSettings.footerLine}
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ashborn Aries Label · {siteSettings.domain}
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/releases', label: 'Releases' },
  { href: '/artists', label: 'Artists' },
  { href: '/lyrics', label: 'Lyrics & Stories' },
  { href: '/label', label: 'Label' },
  { href: '/visual-world', label: 'Visual World' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'border-b border-bronze/30 bg-background/95 backdrop-blur-md'
          : 'bg-gradient-to-b from-background/80 to-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Ashborn Aries Label — Home">
          <Image
            src="/images/brand/brand-seal.webp"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-bronze/40 object-cover"
          />
          <span className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-gold md:text-base">
            Ashborn Aries
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative font-sans text-xs font-medium uppercase tracking-widest transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300',
                pathname === link.href
                  ? 'text-gold after:w-full'
                  : 'text-foreground/70 after:w-0 hover:text-gold hover:after:w-full',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/releases"
            className="ember-glow rounded-sm border border-primary bg-primary px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Listen Now
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-gold lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-bronze/30 bg-background/98 px-4 pb-8 pt-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block rounded-sm px-3 py-3 font-serif text-lg tracking-wide transition-colors',
                    pathname === link.href ? 'text-gold' : 'text-foreground/80 hover:text-gold',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <Link
                href="/releases"
                className="block rounded-sm border border-primary bg-primary px-4 py-3 text-center font-sans text-sm font-semibold uppercase tracking-widest text-primary-foreground"
              >
                Listen Now
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

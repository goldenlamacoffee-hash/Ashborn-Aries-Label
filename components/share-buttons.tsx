'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://ashbornaries.music${path}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  const shareLinks = [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shareLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-bronze/50 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-gold transition-colors hover:border-ember/60 hover:text-ember"
        >
          {s.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-sm border border-bronze/50 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-gold transition-colors hover:border-ember/60 hover:text-ember"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}

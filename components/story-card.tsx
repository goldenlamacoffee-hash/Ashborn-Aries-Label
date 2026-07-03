import Link from 'next/link'
import { BronzePanel } from '@/components/bronze-panel'

export function StoryCard({
  title,
  note,
  href,
}: {
  title: string
  note: string
  href: string
}) {
  return (
    <BronzePanel className="flex h-full flex-col gap-4 p-6">
      <h3 className="font-serif text-lg font-semibold tracking-wide text-foreground text-balance">
        {title}
      </h3>
      <p className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground">{note}</p>
      <Link
        href={href}
        className="font-sans text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-ember"
      >
        Read Lyrics
      </Link>
    </BronzePanel>
  )
}

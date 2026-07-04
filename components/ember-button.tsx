import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 font-display text-sm font-semibold uppercase tracking-widest px-6 py-3 rounded-sm border transition-all duration-300 ember-glow'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-copper to-[#3d1a0f] text-foreground border-gold/80 hover:border-gold hover:-translate-y-0.5',
  secondary:
    'bg-transparent text-gold border-bronze hover:text-foreground hover:border-gold hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-muted-foreground border-transparent hover:text-gold',
}

export function EmberButton({
  href,
  variant = 'primary',
  className,
  children,
  ...props
}: {
  href?: string
  variant?: Variant
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], className)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

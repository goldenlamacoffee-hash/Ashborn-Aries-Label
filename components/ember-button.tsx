import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest px-6 py-3 rounded-sm border transition-all duration-300 ember-glow'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground border-primary hover:bg-gold hover:-translate-y-0.5',
  secondary:
    'bg-transparent text-primary border-bronze hover:text-gold hover:-translate-y-0.5',
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

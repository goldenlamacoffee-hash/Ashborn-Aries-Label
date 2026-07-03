import { cn } from '@/lib/utils'

/** Dark charcoal panel with a thin bronze border and subtle ember hover glow. */
export function BronzePanel({
  className,
  glow = true,
  children,
}: {
  className?: string
  glow?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-sm border border-bronze/40 bg-card/80 backdrop-blur-sm',
        glow && 'ember-glow',
        className,
      )}
    >
      {children}
    </div>
  )
}

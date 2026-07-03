import { cn } from '@/lib/utils'

/** Thin bronze divider with an optional horn ornament in the center. */
export function SectionDivider({
  ornament = true,
  align = 'center',
  className,
}: {
  ornament?: boolean
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
      role="separator"
      aria-hidden="true"
    >
      <div className="bronze-divider w-full max-w-40" />
      {ornament && (
        <svg
          width="28"
          height="16"
          viewBox="0 0 28 16"
          fill="none"
          className="shrink-0 text-gold/70"
        >
          {/* Simplified ram-horn ornament */}
          <path
            d="M2 12c2-7 8-9 12-6 4-3 10-1 12 6-3-3-7-4-9-1-1 1.5-2 1.5-3 0-2-3-6-2-9 1H2z"
            fill="currentColor"
          />
        </svg>
      )}
      <div className="bronze-divider w-full max-w-40" />
    </div>
  )
}

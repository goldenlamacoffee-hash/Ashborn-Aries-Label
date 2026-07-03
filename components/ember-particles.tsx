/**
 * Lightweight decorative floating embers (pure CSS animation).
 * Deterministic values so server and client markup match.
 */
const embers = [
  { left: '8%', size: 4, duration: 14, delay: 0 },
  { left: '18%', size: 3, duration: 18, delay: 4 },
  { left: '31%', size: 5, duration: 16, delay: 2 },
  { left: '44%', size: 3, duration: 20, delay: 7 },
  { left: '57%', size: 4, duration: 15, delay: 1 },
  { left: '68%', size: 3, duration: 19, delay: 5 },
  { left: '79%', size: 5, duration: 17, delay: 3 },
  { left: '90%', size: 3, duration: 21, delay: 8 },
]

export function EmberParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember-particle"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

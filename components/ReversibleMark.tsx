// Original reversible-image art for the onboarding build (NOT the brand logo).
// Two mirrored line-art halves draw toward each other and meet to form a heart.
// The contour draws itself as `progress` rises 0→1, so the user watches their
// So&So come into being.
type Props = {
  progress?: number // 0 = blank, 1 = fully drawn
  name?: string
  size?: number
  animate?: boolean
}

const INK = '#1A1A1A'

// Left half of a clean heart: bottom point → up the side → over the lobe → top cleft.
const SIDE =
  'M160,248 C142,212 106,188 98,150 C92,118 108,92 132,92 C149,92 158,104 160,118'

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function ReversibleMark({ progress = 1, name, size = 150, animate = true }: Props) {
  const p = clamp01(progress)
  const transition = animate ? 'stroke-dashoffset 700ms ease' : undefined
  const dash = { strokeDasharray: 1, strokeDashoffset: 1 - p, transition }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 320 300"
        width={size}
        height={(size * 300) / 320}
        fill="none"
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="So&So"
      >
        {/* Left half — drawn from the point up over the lobe */}
        <path d={SIDE} pathLength={1} style={dash} />
        {/* Right half — mirror about the centre line (x=160) */}
        <path d={SIDE} pathLength={1} style={dash} transform="translate(320,0) scale(-1,1)" />
      </svg>
      {name && <span className="text-lg font-medium tracking-tight">{name}</span>}
    </div>
  )
}

// Original reversible-image art for the onboarding build (NOT the brand logo).
// Two mirrored face profiles draw toward each other and meet — the line that
// forms each profile is also one side of a heart, so the finished mark reads
// both ways. The contour draws itself as `progress` rises 0→1, so the user
// watches their So&So come into being.
type Props = {
  progress?: number // 0 = blank, 1 = fully drawn
  name?: string
  size?: number
  animate?: boolean
}

const INK = '#1A1A1A'

// Left side: top cleft → forehead/lobe → nose notch → chin, down to the point.
// Mirrored to form the right side, the gap between the two reads as a heart.
const SIDE =
  'M160,250 C150,205 128,180 116,156 C100,134 92,112 104,92 ' +
  'C118,70 150,74 160,96'

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function ReversibleMark({ progress = 1, name, size = 150, animate = true }: Props) {
  const p = clamp01(progress)
  const transition = animate ? 'stroke-dashoffset 700ms ease, opacity 500ms ease' : undefined
  const dash = { strokeDasharray: 1, strokeDashoffset: 1 - p, transition }
  const eyeOpacity = p > 0.75 ? 0.9 : 0

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
        {/* Left "So" — drawn from the chin up over the forehead */}
        <path d={SIDE} pathLength={1} style={dash} />
        {/* Right "So" — mirror about the centre line (x=160) */}
        <path d={SIDE} pathLength={1} style={dash} transform="translate(320,0) scale(-1,1)" />
        {/* the two faces' eyes, appearing once the heart is nearly complete */}
        <circle cx="118" cy="118" r="3" fill={INK} stroke="none" opacity={eyeOpacity} style={{ transition }} />
        <circle cx="202" cy="118" r="3" fill={INK} stroke="none" opacity={eyeOpacity} style={{ transition }} />
      </svg>
      {name && <span className="text-lg font-medium tracking-tight">{name}</span>}
    </div>
  )
}

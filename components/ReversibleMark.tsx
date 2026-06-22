// Original reversible-image art for the onboarding build (NOT the brand logo).
// Two mirrored face profiles face each other — "So" & "So" — and the negative
// space between them reads as a vase (a Rubin's-vase illusion). The single
// contour line draws itself as `progress` rises 0→1, so the user watches their
// So&So come into being.
type Props = {
  progress?: number // 0 = blank, 1 = fully drawn
  name?: string
  size?: number
  animate?: boolean
}

const INK = '#1A1A1A'

// Left face's front contour (forehead → nose → lips → chin → jaw), kept left of
// the centre line (x=160) so the mirrored copy forms the vase between the noses.
const PROFILE =
  'M148,52 C141,80 139,106 146,126 C151,143 156,150 156,170 ' +
  'C156,182 146,186 150,196 C156,200 156,210 150,221 ' +
  'C145,233 154,243 152,259 C150,279 134,289 118,302'

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
        viewBox="0 0 320 360"
        width={size}
        height={(size * 360) / 320}
        fill="none"
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="So&So"
      >
        {/* Left "So" */}
        <path d={PROFILE} pathLength={1} style={dash} />
        {/* Right "So" — mirror about the centre line (x=160) */}
        <path d={PROFILE} pathLength={1} style={dash} transform="translate(320,0) scale(-1,1)" />
      </svg>
      {name && <span className="text-lg font-medium tracking-tight">{name}</span>}
    </div>
  )
}

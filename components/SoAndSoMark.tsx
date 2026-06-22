// The So&So mark: a single continuous-line face profile inside a frame — a
// "reversible image". During onboarding the line literally draws itself as
// `progress` rises 0→1, so the user watches their So&So come into being.
//
// Each animated path uses pathLength="1" so stroke-dashoffset can be driven by
// a 0→1 fraction regardless of the path's real length.
type Props = {
  progress?: number // 0 = blank, 1 = fully drawn
  name?: string
  size?: number
  animate?: boolean
}

const INK = '#1A1A1A'

// Continuous line: forehead → nose → lips → chin → jaw → neck, meeting the frame.
const PROFILE =
  'M161,25 C150,70 148,112 150,150 C152,186 176,200 179,221 C181,236 165,240 160,248 ' +
  'C172,250 179,258 177,268 C175,279 165,283 168,293 C183,301 189,316 184,331 ' +
  'C180,351 150,360 120,366 C90,373 60,386 46,409'

// Frame, drawn with a gap at the top where the profile descends.
const FRAME_MAIN = 'M172,25 H279 V409 H46'
const FRAME_TOP_LEFT = 'M22,25 H150'
const FRAME_LEFT = 'M22,25 V380'

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function SoAndSoMark({ progress = 1, name, size = 150, animate = true }: Props) {
  // Frame fills in first, then the profile line draws across the rest.
  const pFrame = clamp01(progress / 0.25)
  const pProfile = clamp01((progress - 0.15) / 0.85)
  const transition = animate ? 'stroke-dashoffset 650ms ease' : undefined

  const dash = (p: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: 1 - p,
    transition,
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 300 420"
        width={size}
        height={(size * 420) / 300}
        fill="none"
        stroke={INK}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="So&So"
      >
        <g strokeWidth={1.4} opacity={0.85}>
          <path d={FRAME_TOP_LEFT} pathLength={1} style={dash(pFrame)} />
          <path d={FRAME_LEFT} pathLength={1} style={dash(pFrame)} />
          <path d={FRAME_MAIN} pathLength={1} style={dash(pFrame)} />
        </g>
        <path d={PROFILE} pathLength={1} strokeWidth={2.4} style={dash(pProfile)} />
      </svg>
      {name && <span className="text-lg font-medium tracking-tight">{name}</span>}
    </div>
  )
}

// Placeholder So&So line-art face. Five named stroke groups ink in as `wake` rises 0→5.
// TODO: swap for the real So&So line-art asset when provided (keep 5 data-stroke groups).
type Props = { wake?: number; name?: string }

const INK = '#1A1A1A'

export function SoAndSoFace({ wake = 0, name }: Props) {
  const lit = (i: number) => ({
    opacity: i < wake ? 1 : 0.18,
    transition: 'opacity 600ms ease, stroke 600ms ease',
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 120 120"
        width="140"
        height="140"
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="So&So face"
      >
        {/* 0: head outline */}
        <g data-stroke="head" style={lit(0)}>
          <circle cx="60" cy="60" r="44" />
        </g>
        {/* 1: left eye */}
        <g data-stroke="left-eye" style={lit(1)}>
          <circle cx="44" cy="52" r="4.5" fill={INK} stroke="none" />
        </g>
        {/* 2: right eye */}
        <g data-stroke="right-eye" style={lit(2)}>
          <circle cx="76" cy="52" r="4.5" fill={INK} stroke="none" />
        </g>
        {/* 3: brows */}
        <g data-stroke="brows" style={lit(3)}>
          <path d="M36 42 q8 -5 16 0" />
          <path d="M68 42 q8 -5 16 0" />
        </g>
        {/* 4: mouth */}
        <g data-stroke="mouth" style={lit(4)}>
          <path d="M44 78 q16 14 32 0" />
        </g>
      </svg>
      {name && <span className="text-lg font-medium tracking-tight">{name}</span>}
    </div>
  )
}

// The exact So&So logo, vectorized so it can draw itself: the outline strokes on
// with a pen motion, then the solid fill fades in for a pixel-exact final state.
// Pure CSS — animates once on load.
import { LOGO_PATH } from './logoPath'

export function SelfDrawingLogo({ width = 120 }: { width?: number }) {
  const height = Math.round((width * 1216) / 848)
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 848 1216"
      role="img"
      aria-label="So&So"
      fill="none"
    >
      <path d={LOGO_PATH} fillRule="evenodd" fill="#1A1A1A" stroke="none" className="logo-draw-fill" />
      <path
        d={LOGO_PATH}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="logo-draw-stroke"
      />
    </svg>
  )
}

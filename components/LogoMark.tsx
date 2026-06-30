import { LOGO_PATH } from './logoPath'

// Static vector So&So mark for small placements (header, chat top-left). Uses a
// non-scaling stroke so the lines stay crisp and bold at tiny sizes instead of
// fading to sub-pixel like the raster logo did.
export function LogoMark({ width = 24 }: { width?: number }) {
  const height = Math.round((width * 1216) / 848)
  return (
    <svg width={width} height={height} viewBox="0 0 848 1216" role="img" aria-label="So&So">
      <path
        d={LOGO_PATH}
        fill="#1A1A1A"
        fillRule="evenodd"
        stroke="#1A1A1A"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

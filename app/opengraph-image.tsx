import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'So&So — Not a smarter AI. Yours.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded share card shown when the link is posted (replaces the blank preview).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAEBD7',
          color: '#1A1A1A',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 1080,
            height: 510,
            border: '2px solid #1A1A1A',
            borderRadius: 28,
          }}
        >
          <div style={{ display: 'flex', fontSize: 150, fontWeight: 700, letterSpacing: -3 }}>
            So&So
          </div>
          <div style={{ display: 'flex', marginTop: 18, fontSize: 42, opacity: 0.6 }}>
            Not a smarter AI — yours.
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

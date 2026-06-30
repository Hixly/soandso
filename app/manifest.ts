import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'So&So',
    short_name: 'So&So',
    description: 'A personal AI that’s actually yours — tuned, not prompted.',
    start_url: '/chat',
    display: 'standalone',
    background_color: '#FAEBD7',
    theme_color: '#FAEBD7',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

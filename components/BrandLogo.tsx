import Image from 'next/image'

// The real So&So logo (the reversible line-art face the user provided).
// Native aspect ratio is ~848x1190.
export function BrandLogo({ width = 140 }: { width?: number }) {
  const height = Math.round((width * 1190) / 848)
  return (
    <Image
      src="/so-and-so-logo.jpg"
      alt="So&So"
      width={width}
      height={height}
      priority
      className="mix-blend-multiply"
    />
  )
}

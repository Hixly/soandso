import Image from 'next/image'

export function BrandLogo({ width = 140 }: { width?: number }) {
  const height = Math.round((width * 1216) / 848)
  return (
    <Image
      src="/so-and-so-logo.png"
      alt="So&So"
      width={width}
      height={height}
      priority
    />
  )
}

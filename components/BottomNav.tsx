'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/chat', label: 'Chat' },
  { href: '/memory', label: 'Memory' },
  { href: '/tune', label: 'Tune' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="sticky bottom-0 flex justify-around border-t border-brand-ink/15 bg-brand-bg py-3">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-sm ${active ? 'font-semibold' : 'opacity-60 hover:opacity-100'}`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

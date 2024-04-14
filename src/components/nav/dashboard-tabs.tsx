'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Tab {
  slug: string
  name: string
}

const tabs: Tab[] = [
  {
    name: 'Today',
    slug: 'today',
  },
  {
    name: 'Past Sessions',
    slug: 'sessions',
  },
  {
    name: 'Active Session',
    slug: 'active',
  },
]

export default function DashboardTabs() {
  const pathname = usePathname()
  const subpath = pathname.split('/').at(-1)

  return (
    <div className="inline-flex gap-6">
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.slug}
        >
          <span
            className={cn(
              'text-4xl font-semibold tracking-tighter',
              'hover:text-primary transition-colors ease',
              subpath === tab.slug ? 'text-primary' : 'text-zinc-300',
            )}
          >
            {tab.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

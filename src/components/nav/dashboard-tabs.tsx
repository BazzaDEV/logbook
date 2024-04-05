'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

interface Tab {
  slug: string
  name: string
}

const tabs: Tab[] = [
  {
    name: 'Today',
    slug: '/today',
  },
  {
    name: 'Past Sessions',
    slug: '/sessions',
  },
  {
    name: 'Active Session',
    slug: '/active',
  },
]

export default function DashboardTabs() {
  const [active, setActive] = useState<string>('/today')

  return (
    <div className="inline-flex gap-6">
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.slug}
        >
          <span
            className={cn(
              'text-4xl tracking-tighter',
              active === tab.slug ? 'font-bold' : 'font-semibold text-zinc-300',
            )}
          >
            {tab.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

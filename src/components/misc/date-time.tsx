'use client'

import { Suspense } from 'react'
import { useHydration } from '@/lib/hooks/use-hydration'

function getTimeFromDate(d: Date) {
  const hours = d.getHours()
  const h = hours > 12 ? hours % 12 : hours
  const m = d.getMinutes()
  const mm = m < 10 ? `0${m}` : m
  const period = d.getHours() >= 12 ? 'PM' : 'AM'

  return `${h}:${mm} ${period}`
}

export function LocalTime({ date }: { date: Date | string | number }) {
  const hydrated = useHydration()
  return (
    <Suspense key={hydrated ? 'local' : 'utc'}>
      <time dateTime={new Date(date).toISOString()}>
        {getTimeFromDate(new Date(date))}
        {hydrated ? '' : ' (UTC)'}
      </time>
    </Suspense>
  )
}

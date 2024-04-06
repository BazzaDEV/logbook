'use client'

import { Suspense } from 'react'
import { useHydration } from '@/lib/hooks/use-hydration'
import { toZonedTime } from 'date-fns-tz'
import { useConfigStore } from '@/lib/stores/config-store'

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
  const config = useConfigStore()
  return (
    <Suspense key={hydrated ? 'local' : 'utc'}>
      <time dateTime={new Date(date).toISOString()}>
        {getTimeFromDate(toZonedTime(new Date(date), config.tz))}
        {hydrated ? '' : ' (UTC)'}
      </time>
    </Suspense>
  )
}

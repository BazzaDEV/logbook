import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { WorkSession, WorkSessionEvent } from '@prisma/client'
import { argv0 } from 'process'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dist(a: Date, b: Date) {
  return (a.getTime() - b.getTime()) / 1000
}

export function distFromNow(date: Date) {
  return dist(new Date(), date)
}

export function totalTimePaused(
  session: WorkSession & { events: WorkSessionEvent[] },
) {
  const { events } = session

  let lastPausedTime = null,
    totalPausedTime = 0

  for (const event of events) {
    if (event.type === 'PAUSE' && lastPausedTime === null) {
      lastPausedTime = event.time
    } else if (
      (event.type === 'RESUME' || event.type === 'END') &&
      lastPausedTime !== null
    ) {
      totalPausedTime += dist(event.time, lastPausedTime)
      lastPausedTime = null
    }
  }

  if (lastPausedTime !== null) {
    totalPausedTime += distFromNow(lastPausedTime)
  }

  return totalPausedTime
}

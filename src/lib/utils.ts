import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { WorkSession, WorkSessionEvent } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DistOptions = {
  unit: 's' | 'ms'
}

const DEFAULT_DIST_OPTIONS: DistOptions = {
  unit: 's',
}

export function dist(a: Date, b: Date, options?: DistOptions) {
  options = {
    ...DEFAULT_DIST_OPTIONS,
    ...options,
  }

  const val = a.getTime() - b.getTime()

  return options.unit === 's' ? val / 1000 : val
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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

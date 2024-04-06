'use client'

import { LocalTime } from '@/components/misc/date-time'
import { cn } from '@/lib/utils'
import { WorkSession } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import { HTMLAttributes } from 'react'
import { toZonedTime } from 'date-fns-tz'
import { isToday } from 'date-fns'
import { useConfigStore } from '@/lib/stores/config-store'

const SessionListItem = ({
  session,
  index,
  ...props
}: {
  session: WorkSession
  index: number
} & HTMLAttributes<HTMLDivElement>) => {
  const { startTime, endTime } = session

  return (
    <div
      className={cn(
        'inline-flex gap-4',
        'border border-accent rounded-xl py-2 px-4',
      )}
      {...props}
    >
      <div className="min-w-[160px] inline-flex items-center gap-1 text-sm">
        <LocalTime date={startTime} />
        <ArrowRight className="size-4" />
        <LocalTime date={endTime as Date} />
      </div>
      <div>
        <span className="font-semibold">Session {index}</span>
      </div>
    </div>
  )
}

interface Props {
  sessions: WorkSession[]
}

export default function SessionsList({ sessions }: Props) {
  const config = useConfigStore()
  const today = sessions.filter(({ startTime }) => {
    // Convert UTC date to the local timezone
    const localTime = toZonedTime(startTime, config.tz)
    // Check if the converted date is today
    return isToday(localTime)
  })
  return (
    <div className="flex flex-col gap-1">
      {today.map((s, i) => (
        <SessionListItem
          key={s.id}
          index={i + 1}
          session={s}
        />
      ))}
    </div>
  )
}

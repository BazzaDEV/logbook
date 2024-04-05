import { Card } from '@/components/ui/card'
import { BookOpenCheck, LucideHistory, Pause, Plus } from 'lucide-react'
import { default as prettyMs } from 'pretty-ms'
import mapValues from 'lodash.mapvalues'

interface Props {
  data: {
    today: {
      totalTime: number
      sessionsLogged: number
      timeDistracted: number
    }
  }
}

function parse(prettyMsString: string) {
  // Extending the regex to also match 'ns' for nanoseconds
  const regex = /(\d+)(ns|ms|us|[smhd])/
  const match = prettyMsString.match(regex)

  if (match) {
    const time = {
      value: parseInt(match[1], 10),
      unit: match[2],
    }

    return time.value === 0
      ? {
          value: 0,
          unit: 'm',
        }
      : time
  } else {
    throw new Error('Invalid input format')
  }
}

export default function SessionStatistics({ data }: Props) {
  const stats = mapValues(data.today, (s) =>
    parse(prettyMs(s, { compact: true })),
  )

  return (
    <div className="grid grid-cols-4 gap-2">
      <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <LucideHistory className="size-8 text-muted-foreground" />
          <span className="text-base">Total time</span>
        </div>
        <div className="inline-flex gap-1 items-end">
          <span className="text-6xl font-bold">{stats.totalTime.value}</span>
          <span className="text-xl tracking-tight text-muted-foreground">
            {stats.totalTime.unit}
          </span>
        </div>
      </Card>
      <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <BookOpenCheck className="size-8 text-muted-foreground" />
          <span className="text-base">Sessions logged</span>
        </div>
        <span className="text-6xl font-bold">{data.today.sessionsLogged}</span>
      </Card>
      <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <Pause className="size-8 text-muted-foreground" />
          <span className="text-base">Distracted time</span>
        </div>
        <div className="inline-flex gap-1 items-end">
          <span className="text-6xl font-bold tracking-tighter">
            {stats.timeDistracted.value}
          </span>
          <span className="text-xl tracking-tight text-muted-foreground">
            {stats.timeDistracted.unit}
          </span>
        </div>
      </Card>
      <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between bg-primary shadow-lg select-none cursor-pointer">
        <Plus className="size-16 text-background" />
        <span className="text-zinc-200">
          Start a new <br />
          work session
        </span>
      </Card>
    </div>
  )
}

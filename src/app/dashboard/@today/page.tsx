export const dynamic = 'force-dynamic'

import { validateRequest } from '@/lib/auth'
import { getTodaySessions } from './actions'
import { Card } from '@/components/ui/card'
import { BookOpenCheck, LucideHistory, Pause, Plus } from 'lucide-react'
import SessionsList from './sessions-list'
import SessionControl from './session-control'
import head from 'lodash.head'

export default async function Slot() {
  const { user } = await validateRequest()

  if (!user) {
    return <div>Error: Unauthenticated</div>
  }

  const sessions = await getTodaySessions({ id: user.id })

  const activeSession = head(sessions.filter((s) => s.endTime === null))

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-4xl font-bold tracking-tighter">Today</h2>
      <Stats />
      <SessionControl session={activeSession} />
      <SessionsList sessions={sessions} />
    </div>
  )
}

const Stats = () => (
  <div className="grid grid-cols-4 gap-2">
    <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <LucideHistory className="size-8 text-muted-foreground" />
        <span className="text-base">Total time</span>
      </div>
      <div className="inline-flex gap-1 items-end">
        <span className="text-6xl font-bold">9</span>
        <span className="text-2xl tracking-tight text-muted-foreground">h</span>
      </div>
    </Card>
    <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <BookOpenCheck className="size-8 text-muted-foreground" />
        <span className="text-base">Sessions logged</span>
      </div>
      <span className="text-6xl font-bold">4</span>
    </Card>
    <Card className="rounded-3xl h-44 p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <Pause className="size-8 text-muted-foreground" />
        <span className="text-base">Distracted time</span>
      </div>
      <div className="inline-flex gap-1 items-end">
        <span className="text-6xl font-bold tracking-tighter">56</span>
        <span className="text-xl tracking-tight text-muted-foreground">m</span>
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
